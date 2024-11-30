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
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = this.generateKey(request);
    
    const cachedResponse = await this.cacheManager.get(key);
    if (cachedResponse) {
      return of(cachedResponse);
    }
    
    return next.handle().pipe(
      tap(response => {
        this.cacheManager.set(key, response, { ttl: 60 });
      }),
    );
  }
}
```

### 3. Error Handling
**Implementation:**
```typescript
// src/shared/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
        message: exceptionResponse['message'] || exception.message,
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
```typescript
// src/shared/interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
```

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



