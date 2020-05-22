import React, {useState, useEffect } from "react";

const Courses = (props) => {

    const [courses, setCourses ] = useState([]);

    useEffect(() => {
        fetch("/courses", {
            headers: {
                Authorization: `Bearer ${props.auth.getAccessToken()}`
            }
        }).then(response => {
        if (response.ok) return response.json();
        throw new Error("Network response was not ok.")
    }).then(response => setCourses(response.courses)).catch(error => setCourses(error.message));
    });
    console.log(courses);

return <div>
    <ul>
{courses ? courses.map(course => <li key={course.id}>{course.title}</li>) : "No courses available"}
    </ul>
</div>
}

export default Courses;