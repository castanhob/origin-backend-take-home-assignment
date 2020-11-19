# Origin Backend Take-Home Assignment

For this particular exercise, I used `Typescript` and `NestJS`, mostly because they are currently the most familiar technologies to me and I use them on my daily basis, which lets me focus more on the design patterns and code organization, while implementing the solution.

You can check the deployed version of this exercise by making a POST request on https://origin-backend-bruno-tha.herokuapp.com/risk/profile

Body:
```
{
  "age": 35,
  "dependents": 2,
  "house": {"ownership_status": "owned"},
  "income": 0,
  "marital_status": "married",
  "risk_questions": [0, 1, 0],
  "vehicle": {"year": 2018}
}
```

# Instructions to Run the Code

First, make sure you have both Node and NPM installed (recommended version 10+).

## Install the dependencies

After cloning the repository, run the command:

`npm run install`

## Start the application

After installing the dependencies, run the command:

`npm run start:dev`

## Run Tests

All tests:

`npm run test`

Unit tests:

`npm run test:unit`

Integration tests:

`npm run test:integration`

Coverage:

`npm run test:cov`

# Technical Decisions

## NestJS

As a tool to make the take home challenge easier to implement, and having more time to focus on the architecture and design patterns, I have chosen to use [NestJS](https://nestjs.com/). It is a powerful backend tool to build elegant and concise applications, pretty close to what we see when using .NET, SpringBoot or Angular. The main advantages were the use of available abstractions, such as route mapping on the Controllers (NestJS uses [express](https://expressjs.com/pt-br/) behind the scenes) and the embedded Dependency Injection provided by the framework.

## Dependency Injection and Modules

The app is built using modules as a context separation. It means that for every different context, we are having a folder inside the `modules` root folder. Since the take home challenge only required to calculate the risk profile, we only have the `risk` module, but the structure is ready to implement other additional modules during the app lifetime, as needed.

**Example**:
```
src
  - modules
    - risk
    - account <- future module to register users and deal with signin / signup for example
    - ...
```

By having those modules separated by scopes, we are able to evolve the service in the future by splitting the modules into microservices, for example. Think about a **module** as a very small app.

In order to make tests easier to write and have code being reused frequently, I opted to use DI on this project. It means that a **module** must define which classes are provided to be used on it, and how they are going to be instantiated when required. Every folder inside `modules` has a file responsible for defining those `providers` and the `controllers` to be mapped.

**Example:**
```ts
@Module({
  controllers: [RiskController],
    providers: [
      CalculateAutoRiskScoreUseCase,
      CalculateDisabilityRiskScoreUseCase,
      CalculateHomeRiskScoreUseCase,
      CalculateLifeRiskScoreUseCase,
      CalculateRiskProfileUseCase,
      { provide: RiskScoreBuilder, useValue: new RiskScoreBuilder() }
    ]
})
export class RiskModule {}
```

When a class is instantiated, its going to look on the dependency injection tree to check which class/instance it needs to be provided on the constructor.

The app also has a root module, called **AppModule**, which wraps the children modules, composing the entire application:

```ts
@Module({
  imports: [RiskModule]
})
export class AppModule {}
```

## Clean Architecture

The classes must have their responsibilities and functions well defined by not having any overlap between them. To achieve that, I implemented the **Clean Architecture** (or one of it's implementations) to separate the code responsibility into well scoped layers:

![Module Layers](https://cdn.discordapp.com/attachments/567747758090354708/778730108683943976/Screenshot_from_2020-11-18_18-14-08.png)

The diagram above shows exactly how every single **module** have its components separated and describes what exactly each layers responsibility. It makes it easy to find and know where each file must be located. It's important to note that it works like a stack. The `Presentation Layer` cannot call the `Data Layer` directly. To do so, it must pass thought the `Domain Layer`, which has all the business logic.


## Request Body Validation

Every request that has a body is typed. Those requests have `Decorators` that validates them automatically (NestJS uses `class-validator` behind the scenes). This was the best way to validate the input data for this exercise.

**Example**

```ts
export class CalculateRiskProfileRequest {
  @IsDefined()
  @IsInt()
  @Min(0)
  age: number
  ...
```

The rule above basically tells us that the property `age` must be defined, must be an integer and has a minimum value 0. If any of those rules are met, an exception is thrown.

## Custom Filters and Pipes

In case of any problem during the code execution or request validation, there are filters which catch those exceptions and convert them to a standard output.

**Example**

```ts
@Catch(ValidationException)
export  class  ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    return HttpResult.BAD_REQUEST(response, exception.message)
  }
}
```

The body for all responses in the app looks like this (for either success or failure):

```
{
  statusCode: 200
  errors: []
  data: {}
}
```

## Controllers

As previously mentioned, every **module** have a collection of **Controllers**, which maps a route.

**Example:**

```ts
@Controller('/risk')
export class RiskController {
  constructor(private readonly calculateRiskProfileUseCase: CalculateRiskProfileUseCase) {}

  @Post('/profile')
  async calculateRiskProfile(@Body() body: CalculateRiskProfileRequest, @Res() res: Response) {
    const response = await this.calculateRiskProfileUseCase.execute(body)
    HttpResult.OK(res, response)
  }
}
```

This **RiskController** has the route `POST /risk/profile` mapped, which will invoke an use case.

## UseCases

**Use cases** are the way chosen to reflect an action in our app. It tries to reflect a "real world" action, making it easy to encapsulate a business logic into a file. So, in case you would want to know where the profile risk calculation is done, you probably will look for the use case with a name close to it, such as `CalculateRiskProfileUseCase`. Use cases can call other use cases or access anything from the **Data Layer** (like repositories).

## Builder

For this particular exercise, I had a problem where my auto, life, disability and home risk scores were repeating the many validations logic inside among them. So I thought about using the **Builder** pattern to solve it. By having a class capable of building something, based on what it has set, made me able to reuse a lot of code, make it cleaner and readable at the same time. Check the **RiskScoreBuilder** to see the results!

## Tests

### Unit

For the unit tests, I mainly focused on testing everything inside `domain/builders` and `domain/usecases`. Those folders have the core business logic of the application. They are testing if the input and output are the expected on every context.

### Integration

Since we only had one endpoint, there is only one integration test. Focusing on all files from `presenter/controllers`, the idea is without mocking anything, making a request to `POST /risk/profile` using an input and comparing the output to a known result makes us able to know that the entire chain is working properly.

# Comments

I hope that you, the person which spent time reading all of this, really like it! I truly put a lot of effort to show how I like to organize my code and how I think it's a good way to build scalable and maintainable software in a healthy way, the best way I could. Of course no pattern is a silver bullet, but to me, that is the best part about all of this: creating collaborative things to make them as great as possible!
Feel free to ask me anything if any part of the code is not that clear.

That's it for now! Have an amazing day! ❤️

---

# The Take Home Assignment Challenge

Origin offers its users an insurance package personalized to their specific needs without requiring the user to understand anything about insurance. This allows Origin to act as their *de facto* insurance advisor.

Origin determines the user’s insurance needs by asking personal & risk-related questions and gathering information about the user’s vehicle and house. Using this data, Origin determines their risk profile for **each** line of insurance and then suggests an insurance plan (`"economic"`, `"regular"`, `"responsible"`) corresponding to her risk profile.

For this assignment, you will create a simple version of that application by coding a simple API endpoint that receives a JSON payload with the user information and returns her risk profile (JSON again) – you don’t have to worry about the frontend of the application.

## The input
First, the would-be frontend of this application asks the user for her **personal information**. Then, it lets her add her **house** and **vehicle**. Finally, it asks her to answer 3 binary **risk questions**. The result produces a JSON payload, posted to the application’s API endpoint, like this example:

```JSON
{
  "age": 35,
  "dependents": 2,
  "house": {"ownership_status": "owned"},
  "income": 0,
  "marital_status": "married",
  "risk_questions": [0, 1, 0],
  "vehicle": {"year": 2018}
}
```

### User attributes
All user attributes are required:

- Age (an integer equal or greater than 0).
- The number of dependents (an integer equal or greater than 0).
- Income (an integer equal or greater than 0).
- Marital status (`"single"` or `"married"`).
- Risk answers (an array with 3 booleans).

### House
Users can have 0 or 1 house. When they do, it has just one attribute: `ownership_status`, which can be `"owned"` or `"mortgaged"`.

### Vehicle
Users can have 0 or 1 vehicle. When they do, it has just one attribute: a positive integer corresponding to the `year` it was manufactured.

## The risk algorithm
The application receives the JSON payload through the API endpoint and transforms it into a *risk profile* by calculating a *risk score* for each line of insurance (life, disability, home & auto) based on the information provided by the user.

First, it calculates the *base score* by summing the answers from the risk questions, resulting in a number ranging from 0 to 3. Then, it applies the following rules to determine a *risk score* for each line of insurance.

1. If the user doesn’t have income, vehicles or houses, she is ineligible for disability, auto, and home insurance, respectively.
2. If the user is over 60 years old, she is ineligible for disability and life insurance.
3. If the user is under 30 years old, deduct 2 risk points from all lines of insurance. If she is between 30 and 40 years old, deduct 1.
4. If her income is above $200k, deduct 1 risk point from all lines of insurance.
5. If the user's house is mortgaged, add 1 risk point to her home score and add 1 risk point to her disability score.
6. If the user has dependents, add 1 risk point to both the disability and life scores.
7. If the user is married, add 1 risk point to the life score and remove 1 risk point from disability.
8. If the user's vehicle was produced in the last 5 years, add 1 risk point to that vehicle’s score.

This algorithm results in a final score for each line of insurance, which should be processed using the following ranges:

- **0 and below** maps to **“economic”**.
- **1 and 2** maps to **“regular”**.
- **3 and above** maps to **“responsible”**.


## The output
Considering the data provided above, the application should return the following JSON payload:

```JSON
{
    "auto": "regular",
    "disability": "ineligible",
    "home": "economic",
    "life": "regular"
}
```

## Criteria
You may use any language and framework provided that you build a solid system with an emphasis on code quality, simplicity, readability, maintainability, and reliability, particularly regarding architecture and testing. We'd prefer it if you used Python, but it's just that – a preference.

Be aware that Origin will mainly take into consideration the following evaluation criteria:
* How clean and organized your code is;
* If you implemented the business rules correctly;
* How good your automated tests are (qualitative over quantitative).

Other important notes:
* Develop a extensible recommendation engine
* Add to the README file: (1) instructions to run the code; (2) what were the main technical decisions you made; (3) relevant comments about your project
* You must use English in your code and also in your docs

This assignment should be doable in less than one day. We expect you to learn fast, **communicate with us**, and make decisions regarding its implementation & scope to achieve the expected results on time.

It is not necessary to build the screens a user would interact with, however, as the API is intended to power a user-facing application, we expect the implementation to be as close as possible to what would be necessary in real-life. Consider another developer would get your project/repository to evolve and implement new features from exactly where you stopped.


