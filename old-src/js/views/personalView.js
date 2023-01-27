class PersonalView {
    // make a parent element a private method
    #parentElement = document.querySelector('.footer');
    #data;
    // #contactField;




    // the public render method recieves data
    render(data) {
        this.#data = data;
        const markup = this.#generateMarkup();
        this.#clear();
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);

    }

    // Method for clearing all markup from parent element
    #clear() {
        this.#parentElement.innerHTML = '';
    }

    // Publisher Subscriber: Addhandler (events controller) - needs to be public
    addHandlerProcessForm(handler) {
        this.#parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        });
    }







    // as there will be differant views we need to split it off to a private method called #generateMarkup
    #generateMarkup()  {

        // Debugging
        //console.log(this.#data);

        return `

            <div class="footer__box"> 
            <div class="footer__box--left">
                <div class="footer__items--left">
                    <h2 class="footer__header">Contact me</h2>

                    <p class="footer__text">${this.#data.contactMe}</p> 

                    <form action="https://formsubmit.co/${this.#data.email}" method="POST">

                        <input type="text" name="_honey" style="display:none">

                        <input type="email" name="email" placeholder="Email Address" required>

                        <input type="hidden" name="_next" value="${this.#data.thankspage}">

                        <input type="hidden" name="_subject" value="${this.#data.subject}">

                        <input type="text" name="message" cols="40" rows="3" placeholder="Write your message here" required>

                        <button type="submit" class="button">Send</button>
                    </form>
                            

                </div>
            </div>



            <div class="footer__box--middle">
                <div class="footer__items--middle">

                    <h2 class="footer__header">${this.#data.fullname}</h2>

                    <img class="jpic" src="../../img/footer-craig-300-2x.jpg" alt="Craig">
                
                    <div class="footer__text footer__text--middle">${this.#data.kindWords}</div>
                    


                </div>
            </div>

            <div class="footer__box--right">
                <div class="footer__items--right">
                    
                    <div class="footer__text footer__items--right--one">
                        ${this.#data.mobile}<br>
                        ${this.#data.email}<br>  
                    </div>
                
                    <div class="footer__text footer__items--right--two">
                        ${this.#data.addressOne}<br>
                        ${this.#data.addressTwo}<br>
                        ${this.#data.addressThree}
                    </div>

                    <div class="footer__icon row social footer__items--right--three">
                        <a target = "blank" href='${this.#data.instagram}'>
                            <img class="instagram__icon" src="../../img/instagram-logo.png" alt="For honey">
                        </a>
                    </div>

                </div>
            </div>
        </div> 
        
        `;
    }
};

// We dont export the class we just create an object then export that
// Son nobody outside of this class will have access to the class only the exported object 
export default new PersonalView();


