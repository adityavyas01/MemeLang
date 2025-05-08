hi_bhai
  // Define a Person class
  class Person {
    // Constructor
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
    
    // Method to greet
    namaste() {
      wapas "Namaste, my name is " + this.name + " and I am " + this.age + " years old.";
    }
    
    // Method to have a birthday
    birthday() {
      this.age = this.age + 1;
      wapas this.name + " is now " + this.age + " years old!";
    }
  }
  
  // Define a Student class that extends Person
  class Student extends Person {
    // Constructor with super call
    constructor(name, age, subject) {
      super(name, age);
      this.subject = subject;
    }
    
    // Override the namaste method
    namaste() {
      wapas "Namaste, I am " + this.name + ", a student of " + this.subject + ".";
    }
    
    // Method to study
    study() {
      wapas this.name + " is studying " + this.subject + "!";
    }
  }
  
  // Create a Person instance
  rakho rahul = new Person("Rahul", 25);
  chaap(rahul.namaste());
  chaap(rahul.birthday());
  
  // Create a Student instance
  rakho priya = new Student("Priya", 20, "Computer Science");
  chaap(priya.namaste());
  chaap(priya.study());
  chaap(priya.birthday());
bye_bhai
