"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassA {
    constructor(arg) {
        this.id = 0;
        this.name = '';
        this.address = '';
    }
}
class ClassB {
    constructor() {
        this.id = 0;
        this.name = '';
        this.age = 0;
    }
}
function activator(type, ...arg) {
    // if(arg)
    return new type(...arg);
    //return new type()
}
const classcc = activator(ClassA);
const classee = activator(ClassA, ['']);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vY3VzdG9tVHlwZXMvcGxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BLE1BQU0sTUFBTTtJQUlSLFlBQVksR0FBUztRQUhkLE9BQUUsR0FBVyxDQUFDLENBQUM7UUFDZixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ2xCLFlBQU8sR0FBVyxFQUFFLENBQUM7SUFHNUIsQ0FBQztDQUNKO0FBRUQsTUFBTSxNQUFNO0lBQVo7UUFDVyxPQUFFLEdBQVcsQ0FBQyxDQUFDO1FBQ2YsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUNsQixRQUFHLEdBQVcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Q0FBQTtBQUVELFNBQVMsU0FBUyxDQUF5QixJQUFxQixFQUFFLEdBQUcsR0FBUztJQUMzRSxVQUFVO0lBQ1QsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLG1CQUFtQjtBQUN2QixDQUFDO0FBRUQsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDIn0=