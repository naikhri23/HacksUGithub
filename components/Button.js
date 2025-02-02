import React, { useRef } from "react";

export default function MyButton({ title, typeOfClick }) {
    const fileInputRef = useRef(null);

    function clickDefault() {
        alert("You clicked me!");
    }

    function handleClick(event) {
        event.preventDefault(); // Prevents page from reloading when clicked on button
        if (typeOfClick === "upload") {
            fileInputRef.current.click(); // Open file input only if typeOfClick is "upload"
        } else {
            clickDefault(); // Default action for non-upload buttons
        }
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]; //PDF, PPT, PPTX
            if(!allowedTypes.includes(file.type)) {
                alert("Only PDF and PowerPoint files are allowed!");
                event.target.value = ""; // Reset file input
                return;
            }
            alert(`File selected: ${file.name}`);
        }
    }

    return (
        <div>
            <button
                onClick={handleClick}
                style={{
                    backgroundColor: typeOfClick === "upload" ? "green" : "blue",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    margin: "5px",
                }}
            >
                {title}
            </button>

            {/* Hidden file input for file upload */}
            {typeOfClick === "upload" && (
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".pdf, .ppt, .pptx"
                    onChange={handleFileChange}
                />
            )}
        </div>
    );
}