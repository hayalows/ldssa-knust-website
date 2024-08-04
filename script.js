document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.querySelector('.connect');
    const learnMoreLink = document.querySelector('.learn-more-link');

    connectButton.addEventListener('click', () => {
        alert('Thank you for connecting with us!');
    });

    learnMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Learn more about our community here!');
    });
});