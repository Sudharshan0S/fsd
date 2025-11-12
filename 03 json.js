const student = {
    name: "Alice",
    grade: 65,
    subjects: ["Math", "Science", "English"],

    // Method to display student info
    displayInfo: function() {
        console.log("Student Name:", this.name);
        console.log("Grade:", this.grade);
        console.log("Subjects:", this.subjects.join(", "));
    }
};

// 2. Call displayInfo method
student.displayInfo();

// 3. Dynamically add 'passed' property
student.passed = student.grade >= 50; // true if grade >= 50, else false

// 4. Loop through all keys and values in the student object
console.log("\nAll properties of student:");
for (let key in student) {
    // Check if the property is a function or value
    if (typeof student[key] === "function") {
        console.log(`${key}: [Function]`);
    } else {
        console.log(`${key}:`, student[key]);
    }
}
