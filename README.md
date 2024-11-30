# Task Management System

A robust task management system built with Nodejs, featuring project organization, task tracking, and real-time notifications.

## Technology Stack

### Framework: NestJS
NestJS was chosen for several compelling reasons:
- **TypeScript-first**: Provides strong typing and OOP principles
- **Modular Architecture**: Built-in support for modularity using decorators
- **Dependency Injection**: Native DI container for better code organization
- **OpenAPI (Swagger)**: Automatic API documentation generation
- **Built-in Features**: Guards, interceptors, pipes for cross-cutting concerns
- **Enterprise-Ready**: Scalable architecture suitable for large applications

## Installation & Configuration
You can refer to the .env.example file and update all variables to match your own configuration
### Prerequisites
- Node.js
- PostgreSQL
- Redis

### Database Setup

```
env
PostgreSQL configuration in .env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=task_management
```
### Redis Configuration

```
Redis configuration in .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```


### Project Setup

# Install dependencies
```
pnpm install
```

# Start development server
Run the following command to start the development server: and access the API via http://localhost:{port}/docs
```
npm run start:dev
```

## Code Structure
The project follows Domain-Driven Design (DDD) and Dependency Injection principles:

```
src/
├── modules/
│   ├── api/
│   │   ├── controllers/   # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── dtos/          # Data transfer objects
│   │   ├── guards/        # Authentication guards
│   │   └── validations/   # Input validation
│   ├── database/
│   │   └── entities/      # Database models
│   └── shared/            # Shared utilities
```


### Database Design

#### Core Entities
- **Users**
  - id (UUID)
  - email
  - username
  - password
  - created_at
  - updated_at

- **Projects**
  - id (UUID)
  - name
  - description
  - created_by (FK to Users)
  - created_at
  - updated_at

- **Tasks**
  - id (UUID)
  - title
  - description
  - status
  - priority
  - project_id (FK to Projects)
  - assignee_id (FK to Users)
  - created_at
  - updated_at

- **Comments**
  - id (UUID)
  - content
  - task_id (FK to Tasks)
  - user_id (FK to Users)
  - created_at
  - updated_at

- **Notifications**
  - id (UUID)
  - type
  - content
  - user_id (FK to Users)
  - read_at
  - created_at

## API Endpoints

### Authentication
- `POST /auth/sign-up` - User registration
- `POST /auth/sign-in` - User login
- `GET /auth/google` - User login with Google OAuth
- `GET /auth/google-redirect` - Google OAuth redirect

### Projects
```typescript
GET /projects # List all projects (cached)
POST /projects # Create new project
GET /projects/:id # Get project details (cached)
PUT /projects/:id # Update project
```

### Tasks
```typescript
GET /tasks # List all tasks (cached)
POST /tasks # Create new task
GET /tasks/:id # Get task details
PUT /tasks/:id # Update task
GET /tasks/:id/comments # Get task comments
```


### Profile & Notifications
```typescript
GET /profile # Get user profile
PUT /profile # Update profile
GET /profile/notifications # Get user notifications
GET /profile/unread-notifications # Get unread count (cached)
PUT /profile/read-all-notifications # Mark all as read
```
### Comments
```typescript
POST /comments # Create new comment
GET /comments/:id # Get comment details
PUT /comments/:id # Update comment
```

###Features & Implementations

### 1. Real-time Notifications
**Implementation:**
```typescript
// src/modules/api/controllers/profile.controller.ts
@Get('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
public async getListNotification(
  @Request() req: any,
  @Query() filter: PaginateDto,
) {
  const result = await this.notificationService.getListNotifications({
    ...filter,
    user_ids: [req.user.sub],
  });
}

// src/modules/api/services/notification.service.ts
@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  handleNotification(payload: any) {
    this.server.emit('notification', payload);
  }
}
```

### 2. Cache Management
**Implementation:**
```typescript
// src/modules/api/cache/http-cache.interceptor.ts
@Injectable()
export class HttpCacheInterceptor implements CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    const excludePaths = [
      // Routes to be excluded
    ];
    if (
      !isGetRequest ||
      (isGetRequest &&
        excludePaths.includes(httpAdapter.getRequestUrl(request)))
    ) {
      return undefined;
    }
    const { query } = context.getArgByIndex(0);
    const hash = SHA256(
      JSON.stringify({
        query,
        headers: { authorization: request?.headers?.authorization },
      }),
    ).toString();
    return `${httpAdapter.getRequestUrl(request)}_${hash}`;
  }
}
```

### 3. Error Handling
**Implementation:**
```typescript
// src/modules/api/filters/GlobalExceptionFilter.ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseStatus = exception.status
      ? exception.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const messageObject = this.getBackwardsCompatibleMessageObject(
      exception,
      responseStatus,
    );
    let errorId = undefined;
    let integrationErrorDetails = undefined;

    if (responseStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorId = uuidv1();
      integrationErrorDetails =
        GlobalExceptionFilter.extractIntegrationErrorDetails(exception);

      console.error(
        {
          errorId: errorId,
          route: request.url,
          integrationErrorDetails,
          stack:
            exception.stack && JSON.stringify(exception.stack, ['stack'], 4),
        },
        messageObject,
      );
    } else if (
      this.logAllErrors ||
      this.logErrorsWithStatusCode.indexOf(responseStatus) !== -1
    ) {
      console.error(
        {
          route: request.url,
          stack: exception.stack && JSON.stringify(exception.stack),
        },
        messageObject,
      );
    }

    response.status(responseStatus).json({
      errorId: errorId,
      ...this.getClientResponseMessage(responseStatus, exception),
      integrationErrorDetails:
        responseStatus === HttpStatus.INTERNAL_SERVER_ERROR &&
        this.sendClientInternalServerErrorCause
          ? integrationErrorDetails
          : undefined,
    });
  }
}
```

### 4. API Documentation
**Implementation:**
```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for Task Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
```

### 5. Monitoring & Logging
**Implementation:**
We use Logger in @nestjs/common to log the information and error and custom logging

## Testing

### E2E Testing Setup
You can prepare the test environment by cloning the database and update the .env.test file with the correct database credentials.

```typescript
// test/app.e2e-spec.ts
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Test cases
});
```

### Running Tests
```bash
# Run e2e tests
npm run test:e2e
```

## Upcoming Features & Improvements

### 1. Email Notification Service
- [ ] Setup email service integration (NodeMailer/SendGrid)
- [ ] Create email templates for different notifications
  - Task assignment notifications
  - Comment mentions
  - Due date reminders
  - Project updates
- [ ] Implement email queue system using Bull
- [ ] Add email preference settings for users



