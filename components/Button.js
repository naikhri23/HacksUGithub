import React, { useRef } from "react";
import { useRouter } from 'next/navigation'

export default function MyButton({ title, typeOfClick, url, color, disabled }) {
    const fileInputRef = useRef(null);
    const router = useRouter();

    function clickDefault() {
        alert("You clicked me!");
    }

    function handleClick(event) {
        event.preventDefault(); // Prevents page from reloading when clicked on button
        if (typeOfClick === "upload") {
            fileInputRef.current.click(); // Open file input only if typeOfClick is "upload"
        } else if (typeOfClick === 'submit'){
            router.push(`/${url}/teacherView`);
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
                className={color}
                style={{
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    width: "150px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    margin: "5px",
                }}
                disabled={disabled}
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