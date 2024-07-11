$(document).ready(function () {
    $(window).scroll(function () {
        //  sticky navbar on scroll script  //
        if (this.scrollY > 20) {
            $(".navbar").addClass("sticky");
        } else {
            $(".navbar").removeClass("sticky");
        }

        //  scroll-up button show/hide script  //
        if (this.scrollY > 500) {
            $(".scroll-up-btn").addClass("show");
        } else {
            $(".scroll-up-btn").removeClass("show");
        }
    });

    //  slide-up script  //

    $(".scroll-up-btn").click(function () {
        $("html").animate({ scrollTop: 0 });
        //  removing smooth scroll on slide-up button click  //
        $("html").css("scrollBehavior", "auto");
    });

    $(".navbar .menu li a").click(function () {
        //  Smooth scroll on Menu Items click  //

        $("html").css("scrollBehavior", "smooth");
    });

    //  Toggle Navbar  //

    $(".menu-btn").click(function () {
        $(".navbar .menu").toggleClass("active");
        $(".menu-btn i").toggleClass("active");
    });

    //  Typing Text Animation  //

    var typed = new Typed(".typing", {
        strings: [
            "Web Developer",
            "Robotics Trainer",
            "CS Grad"
        ],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });
});
// document.getElementById('contact-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//
//     // Collect form data
//     var name = document.getElementById('name').value;
//     var email = document.getElementById('email').value;
//     var subject = document.getElementById('subject').value;
//     var message = document.getElementById('message').value;
//
//     // Send email
//     emailjs.send('service_t3z7jfc', '7h6AG0ZC6-PEIYcOp', {
//         from_name: name,
//         from_email: email,
//         subject: subject,
//         message: message
//     })
// });

const btn = document.getElementById('button');

document.getElementById('contact-form')
    .addEventListener('submit', function(event) {
        event.preventDefault();

        btn.value = 'Sending...';

        const serviceID = 'default_service';
        const templateID = 'template_9rg5oxt';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Send Email';
                alert('Sent!');
            }, (err) => {
                btn.value = 'Send Email';
                alert(JSON.stringify(err));
            });
    });