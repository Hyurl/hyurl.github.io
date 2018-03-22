# Concept

Running a schedule cyclically is support by 
[sfn-scheduler](https://github.com/hyurl/sfn-scheduler) module, which gives 
you a simple and friendly interface to set a schedule that runs in a certain 
time or period.

## How to use?

As convenience, you should put your schedule files in the `src/schedules/` 
directory, and load them from the bootstrap files.

### Example

```typescript
// src/schedules/index.ts
import { Schedule } from "sfn";

var schedule1 = new Schedule("every 2 seconds", () => {
    console.log("This schedule runs every 2 seconds.");
});

var schedule2 = new Schedule("in 2 days", () => {
    console.log("This schedule has been waiting for 2 days.");
});

console.log(schedule2);

var schedule3 = new Schedule("20:00", () => {
    console.log("This schedule runs at 20:00 this evening.");
});

var schedule4 = new Schedule("*:30", () => {
    console.log("This schedule runs at 30 minutes of every hour in today.");
});

var schedule5 = new Schedule("*-*-1 8:00", () => {
    console.log("This schedule runs on every first day in every month.");
});
```

```typescript
// src/bootstrap/http.ts
import "../schedules/index";

// ...
```

## Schedule pattern

Schedule pattern will be parsed by 
[sfn-schedule-parser](https://github.com/hyurl/sfn-schedule-parser), which 
exposes a common API for Node.js to build schedulers. For full supported 
patterns, you should follow it for newest features.

## How to stop?

You can call the method `stop()` to terminate the schedule whenever you want.

```typescript
var schedule = new Schedule("runs every 2 minutes", () => {
    // ...
    schedule.stop();
});
```

For more details about **Schedule** object, see 
[https://github.com/hyurl/sfn-scheduler](https://github.com/hyurl/sfn-scheduler).