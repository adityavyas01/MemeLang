// A test script for testing OOP features in MemeLang

// Import the interpreter
const { Interpreter } = require('./dist/interpreter');

// Create a test function
async function runTest() {
  console.log('Running OOP test of MemeLang...');
  
  try {
    // Create a single interpreter instance
    const interpreter = new Interpreter();
    
    // Test code with OOP examples
    const code = `
      hi_bhai
        // Example 1: Basic class with constructor and methods
        class Person {
          constructor(name, age) {
            this.name = name;
            this.age = age;
          }
          
          namaste() {
            chaap("Namaste, my name is " + this.name + " and I am " + this.age + " years old.");
          }
          
          birthday() {
            this.age = this.age + 1;
            chaap(this.name + " is now " + this.age + " years old!");
          }
        }
        
        // Example 2: Inheritance
        class Student extends Person {
          constructor(name, age, subject) {
            super(name, age);
            this.subject = subject;
          }
          
          namaste() {
            chaap("Namaste, I am " + this.name + ", a student of " + this.subject + ".");
          }
          
          study() {
            chaap(this.name + " is studying " + this.subject + "!");
          }
        }
        
        // Example 3: Method overriding and super
        class Teacher extends Person {
          constructor(name, age, subject) {
            super(name, age);
            this.subject = subject;
          }
          
          namaste() {
            super.namaste();
            chaap("I teach " + this.subject + ".");
          }
          
          teach() {
            chaap(this.name + " is teaching " + this.subject + "!");
          }
        }
        
        // Test Person class
        chaap("\\nTesting Person class:");
        rakho rahul = new Person("Rahul", 25);
        rahul.namaste();
        rahul.birthday();
        
        // Test Student class
        chaap("\\nTesting Student class:");
        rakho priya = new Student("Priya", 20, "Computer Science");
        priya.namaste();
        priya.study();
        priya.birthday();
        
        // Test Teacher class
        chaap("\\nTesting Teacher class:");
        rakho prof = new Teacher("Dr. Sharma", 45, "Mathematics");
        prof.namaste();
        prof.teach();
        prof.birthday();
        
        // Example 4: Static methods and properties
        class MathHelper {
          static PI = 3.14159;
          
          static square(x) {
            wapas x * x;
          }
          
          static circleArea(radius) {
            wapas this.PI * this.square(radius);
          }
        }
        
        chaap("\\nTesting static methods:");
        chaap("PI = " + MathHelper.PI);
        chaap("Square of 5 = " + MathHelper.square(5));
        chaap("Area of circle with radius 3 = " + MathHelper.circleArea(3));
        
        // Example 5: Private fields (using underscore convention)
        class BankAccount {
          constructor(owner, _balance) {
            this.owner = owner;
            this._balance = _balance;
          }
          
          deposit(amount) {
            this._balance = this._balance + amount;
            chaap(this.owner + " deposited " + amount + ". New balance: " + this._balance);
          }
          
          withdraw(amount) {
            agar (amount <= this._balance) {
              this._balance = this._balance - amount;
              chaap(this.owner + " withdrew " + amount + ". New balance: " + this._balance);
            } nahi {
              chaap("Insufficient funds!");
            }
          }
          
          getBalance() {
            wapas this._balance;
          }
        }
        
        chaap("\\nTesting BankAccount class:");
        rakho account = new BankAccount("Amit", 1000);
        account.deposit(500);
        account.withdraw(200);
        account.withdraw(2000);  // Should show insufficient funds
        chaap("Current balance: " + account.getBalance());
      bye_bhai
    `;
    
    // Run the test and measure time
    console.log('Starting interpreter...');
    const startTime = Date.now();
    const result = await interpreter.interpret(code);
    const endTime = Date.now();
    
    // Display results
    console.log('\nTest output:');
    result.forEach(line => console.log(line));
    
    console.log(`\nExecution time: ${endTime - startTime}ms`);
    
    // Exit with success status
    process.exit(0);
  } catch (error) {
    console.error('Error running test:', error);
    process.exit(1);
  }
}

// Run the test
runTest(); 