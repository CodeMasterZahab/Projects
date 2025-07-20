let currentStep = 0;
const steps = [
    document.getElementById("step1"),
    document.getElementById("step2"),
    document.getElementById("step3")
];

const form = document.getElementById("multistep");
const prevBtn = document.getElementById("prevbtn");
const nextBtn = document.getElementById("nxtbtn");
const submitBtn = document.getElementById("submit");

function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("hidden", i !== index);
    });
    prevBtn.style.display = index === 0 ? "none" : "inline-block";
    nextBtn.style.display = index === steps.length - 1 ? "none" : "inline-block";
    submitBtn.classList.toggle("hidden", index !== steps.length - 1);
}

showStep(currentStep);

prevBtn.addEventListener("click", () => {
    if (currentStep > 0) currentStep--;
    showStep(currentStep);
});

nextBtn.addEventListener("click", () => {
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (currentStep === 1) {
        const file = document.getElementById("ProfilePic").files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                document.getElementById("preview").src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Move to next step first
    if (currentStep < steps.length - 1) currentStep++;
    showStep(currentStep);

    // Now show summary after step is active
    if (currentStep === 2) {
        const name = form.name.value;
        const email = form.email.value;
        const photo = document.getElementById("preview").src;

        document.getElementById("summary").innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Profile Picture:</strong></p>
            <img src="${photo}" class="preview-img" />
        `;
    }
});


form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
});
