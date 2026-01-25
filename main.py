import os

course = ["BSCS", "BSIT", "MIDWIFERY"]
while True:
    os.system('cls' if os.name == 'nt' else 'clear')
    for i in course:
        print(i, end=" | ")

    print("\n Select Option:")
    print("1. Add New Course")
    print("2. Remove Course")
    print("3. Update Course")
    print("4. Exit Program")

    input_option = input("Enter option number: ")

    if input_option == "1":
        new_course = input("Add Course: ")
        if new_course in course:
            print("Course already exist")
            input("Press Enter to Continue...")
        else:
            course.append(new_course)       

    if input_option == "2":
        remove_course = input("Remove Course: ")
        if remove_course in course:
             course.remove(remove_course)

    if input_option == "3":
        selected_course = input("Name the course to edit:")
        if selected_course in course: 
            index = course.index(selected_course)
            course[index] = input("Edit Course: ")
        else:
            print("Course Does no Exist")
            input("Press Enter to Continue...")
    if input_option == "4":
         break
        
