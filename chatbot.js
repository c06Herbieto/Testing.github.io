(function () {
    // 
    // Define the Athena object
    var Athena = function (element, options) {
        this.element = element;
        this.options = options;

        this.init();
    };

    // Define default options for the plugin
    Athena.defaults = {
        color: '#990000',
        icon: 'assets/logo.png',
        position: 'right',
        name: 'Athena',
        tagLine: '',
        token: '',
        font: 'Segoe UI',
        userBubble: {
            backgroundColor: 'F3F2F1',
            borderRadius: 0,
            borderWidth: 0,
            borderColor: 'transparent',
            textColor: '#000'
        },
        botBubble: {
            backgroundColor: 'DC3D6A',
            borderRadius: 0,
            borderWidth: 0,
            borderColor: 'transparent',
            textColor: '#000'
        },
        backgroundColor: '#fff',
        isOpen: false,
        messages: [],
        onMessageSent: null
    };

     Athena.prototype.get_init_token = function () {
        return this.options.token;
    };

    // Initialize the plugin
    Athena.prototype.init = function () {
        // Merge user options with defaults
        this.config = Object.assign({}, Athena.defaults, this.options);
        this.initConfig()

        // axios.defaults.baseURL = "https://athenaservices.azurewebsites.net/api";

        // Attach event listener to icon
        this.element.addEventListener('click', this.openChat.bind(this));
    };

    Athena.prototype.initConfig = async function () {
        let token = this.config.token;
        // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxNDMwYzJlNjc3M2ViZTkyMTc3MWQiLCJpYXQiOjE3MjA2NjQ0NjMsImV4cCI6MTc1MjIwMDQ2M30.MQRz9yaHyhuW93QUMNFoIfY3Cp_ocxYQkonxVLIPrsA"
        let chatbotId = ''
        const axiosInstance = axios.create({
            baseURL: 'https://athenaservice.azurewebsites.net/',
            headers: { 'Content-Type': 'application/json' }
        });

        await getToken(token, this)

        async function getToken(token, element) {
            try {
                if (localStorage.getItem('id')) {
                    token = localStorage.getItem('id')
                    chatbotId = localStorage.getItem('botId')
                    getChatbotDataWhenTokenIsPresent(token, chatbotId, element)
                } else {
                    await axiosInstance.get('/auth/token?grantType=client_credentials', {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    }).then(async (res) => {
                        chatbotId = res.data.data.chatbotId
                        let newAccessToken = res.data.data.token
                        localStorage.setItem('id', newAccessToken)
                        localStorage.setItem('botId', chatbotId)
                        getChatbotDataWhenTokenIsPresent(newAccessToken, chatbotId, element)
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }

        async function getChatbotDataWhenTokenIsPresent(token, chatbotId, element) {
            await axiosInstance.get(`/api/chatbots/${chatbotId}`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then(async (res) => {
                chatbot = res.data.data.chatbot
                initChatBotResource(chatbot, element)
                await axiosInstance.get(`api/chatbots/${chatbotId}/settings`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }).then((res) => {
                    element.config.systemMessage = `Your name is ${element.config.name} , ${res.data.data.systemMessage}`
                    element.config.temperature = res.data.data.temperature
                    element.config.welcomeMessage = res.data.data.welcomeMessage
                })
            }).catch((err) => {
                console.log(err)
                localStorage.removeItem('id')
                localStorage.removeItem('botId')
                getToken(element.get_init_token(), element)
            })
        }

        async function initChatBotResource(chatbot, element) {
            if (chatbot) {
                let name = chatbot.name.charAt(0).toUpperCase() + chatbot.name.slice(1)
                element.config.name = name
                element.config.tagLine = chatbot.tagline ? chatbot.tagline.charAt(0).toUpperCase() + chatbot.tagline.slice(1) : element.config.tagline;
                element.config.color = chatbot.appearance.headerColor ? chatbot.appearance.headerColor : element.config.color;
                element.config.font = chatbot.appearance.fontFamily ? chatbot.appearance.fontFamily : element.config.font;
                element.config.icon = chatbot.image ? chatbot.image : element.config.image;
                element.config.backgroundColor = chatbot.appearance.backgroundColor ? chatbot.appearance.backgroundColor : element.config.backgroundColor;
                element.config.sendButtonColor = chatbot.appearance.sendButtonColor
                //user bubble
                element.config.userBubble = {
                    bubbleColor: chatbot.appearance.userAppearance.bubbleColor,
                    bubbleBorderRadius: chatbot.appearance.userAppearance.bubbleBorderRadius,
                    bubbleBorderWidth: chatbot.appearance.userAppearance.bubbleBorderWidth,
                    bubbleBorderColor: chatbot.appearance.userAppearance.bubbleBorderColor,
                    textColor: chatbot.appearance.userAppearance.textColor
                }
                element.config.botBubble = {
                    bubbleColor: chatbot.appearance.botAppearance.bubbleColor,
                    bubbleBorderRadius: chatbot.appearance.botAppearance.bubbleBorderRadius,
                    bubbleBorderWidth: chatbot.appearance.botAppearance.bubbleBorderWidth,
                    bubbleBorderColor: chatbot.appearance.botAppearance.bubbleBorderColor,
                    textColor: chatbot.appearance.botAppearance.textColor
                }
                // Create chat icon
                element.initChat();
            }

        }
    }

    // Create chat icon
    Athena.prototype.initChat = function () {
        this.element.innerHTML = ""
        var urlPath = this.config.icon
        var chatbotName = this.config.name
        var newDiv = document.createElement('div');
        var newImg = document.createElement('img');
        var newSpan = document.createElement('span')
        var textSpan = document.createTextNode('Talk With ' + chatbotName)

        // Set attributes and content
        newImg.src = urlPath;
        newDiv.style.backgroundColor = this.config.color
        newDiv.className = 'child-div';
        newSpan.style.fontFamily = this.config.font;
        newSpan.style.marginRight = "15px";
        newSpan.appendChild(textSpan)

        // Append elements
        newDiv.appendChild(newImg);
        newDiv.appendChild(newSpan);
        this.element.appendChild(newDiv);


        // this.element.style.backgroundImage = "url('" + urlPath + "')";
        this.element.classList.add('chat-icon', 'chat-icon-' + this.config.position);

    };

    // Open chat window
    Athena.prototype.openChat = function () {
        this.options.isOpen = !this.options.isOpen;
        var cb = document.getElementsByClassName("chat-box")
        if(cb.length !== 0){
            cb[0].style.visibility = "visible"
            this.element.style.backgroundColor = this.config.color;
            this.element.innerHTML = '<div class="chat-icon-close"><svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="40" height="40"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div>';
        }else{
            var logoUrlPath = this.config.icon;
            var chatbotName = this.config.name;
            var position = this.config.position;
            this.element.style.backgroundColor = this.config.color;
            this.element.innerHTML = '<div class="chat-icon-close"><svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="40" height="40"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div>';
            
            // Create chat box
            this.chatBox = document.createElement('div');
            this.chatBox.classList.add('chat-box', 'chat-box-' + this.config.position);
            if (window.innerWidth <= 768) {
                this.chatBox.classList.add('chat-box-mobile');
            }
    
            var chatBoxHeader = document.createElement('div');
            chatBoxHeader.style.backgroundColor = this.config.color;
    
            var headerContainer = document.createElement('div')
            headerContainer.classList.add('chat-box-header-logo-wrapper')
            chatBoxHeader.appendChild(headerContainer)
            // Add chatbox logo
            var chatBoxHeaderLogoContainer = document.createElement('div');
            var chatBoxHeaderLogo = document.createElement('img');
            chatBoxHeaderLogo.src = logoUrlPath;
            chatBoxHeaderLogoContainer.appendChild(chatBoxHeaderLogo)
            headerContainer.appendChild(chatBoxHeaderLogoContainer);
            chatBoxHeaderLogoContainer.classList.add('chat-box-logo-container');
    
            // Add Chatbot Header Text
            var chatBoxHeaderTextDiv = document.createElement('div');
            chatBoxHeaderLogoContainer.appendChild(chatBoxHeaderTextDiv);

            chatBoxHeaderTextDiv.classList.add('chat-box-header-text');
            var chatBoxHeaderTitle = document.createElement('h1');
            chatBoxHeaderTitle.textContent = chatbotName;
            chatBoxHeaderTitle.style.fontFamily = this.config.font;
            chatBoxHeaderTextDiv.appendChild(chatBoxHeaderTitle);

    
            if (this.config.tagLine != "") {
                var chatBoxHeaderTagline = document.createElement('p');
                chatBoxHeaderTagline.textContent = this.config.tagLine;
                chatBoxHeaderTagline.style.fontFamily = this.config.font;
                chatBoxHeaderTextDiv.appendChild(chatBoxHeaderTagline);
            }

            headerContainer.appendChild(chatBoxHeaderTextDiv);
            chatBoxHeader.classList.add('chat-box-header');
    
            // Add close button inside chat-box-header
            var chatBoxCloseButton = document.createElement('div');
            chatBoxCloseButton.classList.add('chat-box-close');
            chatBoxCloseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>';
            chatBoxCloseButton.addEventListener('click', this.closeChat.bind(this));
            chatBoxHeader.appendChild(chatBoxCloseButton);
    
            this.chatBox.appendChild(chatBoxHeader);
    
            // Add chatbot interface
            var chatpaneContainer = document.createElement('div');
            chatpaneContainer.classList.add('chatpane');
            var webchat = document.createElement('div');
            webchat.id = "webchat";
            webchat.role = "main";
            webchat.classList.add('webchat');
    
            chatpaneContainer.appendChild(webchat);
            this.chatBox.appendChild(chatpaneContainer);
    
            document.body.appendChild(this.chatBox);
            this.renderWebChat();
        }

       
        if (!this.options.isOpen) {
             this.closeChat();
        } 
    };

    Athena.prototype.renderWebChat = function () {
        // Set  the CSS rules.
        var styleSet = window.WebChat.createStyleSet({
            rootHeight: '100%',
            rootWidth: '100%',
            backgroundColor: this.config.backgroundColor,
            sendBoxButtonColor: this.config.sendButtonColor,

            // user bubble appearance
            bubbleFromUserBackground: this.config.userBubble.bubbleColor,
            bubbleFromUserTextColor: this.config.userBubble.textColor,
            bubbleFromUserBorderRadius: this.config.userBubble.bubbleBorderRadius + "em",
            bubbleFromUserBorderWidth: this.config.userBubble.bubbleBorderWidth,
            bubbleFromUserBorderColor: this.config.userBubble.bubbleBorderColor,

            // bot bubble apearance
            bubbleBackground: this.config.botBubble.bubbleColor,
            bubbleTextColor: this.config.botBubble.textColor,
            bubbleBorderRadius: this.config.botBubble.bubbleBorderRadius + "em",
            bubbleBorderWidth: this.config.botBubble.bubbleBorderWidth,
            bubbleBorderColor: this.config.botBubble.bubbleBorderColor,
            botAvatarBackgroundColor: 'white',
            userAvatarBackgroundColor: this.config.botBubble.bubbleColor,

        });

        const avatarOptions = {
            botAvatarImage: this.config.icon,
            botAvatarInitials: 'AT',
            // userAvatarInitials: 'WC',
            //userAvatarImage: "img/person-icon.png"
            // botAvatarImage: '<URL to your bot avatar image>',
        };

        const store = window.WebChat.createStore({}, ({ dispatch }) => next => async action => {
            if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
                dispatch({
                    type: 'WEB_CHAT/SEND_EVENT',
                    payload: {
                        name: 'CUSTOM_PARAMETERS',
                        value: {
                            chatbotId: localStorage.getItem('botId'),
                            botName: this.config.name,
                            temperature: this.config.temperature,
                            welcomeMessage: this.config.welcomeMessage,
                            systemMessage: this.config.systemMessage
                        }
                    }
                })
            }

            if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY' && action.payload.activity.from.id !== 'YOUR_USER_ID') {
                this.showTypingIndicator();
            }
            return next(action);
        });
        

        window.WebChat.renderWebChat({
            directLine: window.WebChat.createDirectLine({
                token: '1oIvUk7IsM4.lMJw8u6Ve4VqLp6mNeZBvDfUkV7VrTAPHQ0mQXfyGlA'
            }),
            userID: localStorage.getItem('botId'),
            store: store,
            styleSet,
            styleOptions: avatarOptions
        }, document.getElementById('webchat'));
    };

    Athena.prototype.showTypingIndicator = function (container) {
        // Create the typing indicator wrapper element
        var typingIndicatorWrapper = document.createElement('div');
        typingIndicatorWrapper.classList.add('typing-indicator-wrapper');
    
        // Create the typing indicator element
        var typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    
        // Append the typing indicator to the wrapper
        typingIndicatorWrapper.appendChild(typingIndicator);
    
        // Append the typing indicator wrapper to the specified container
        if (container) {
            container.appendChild(typingIndicatorWrapper);
    
            // Optionally, remove the typing indicator after a certain time
            // setTimeout(() => {
            //     if (typingIndicatorWrapper.parentNode) {
            //         typingIndicatorWrapper.parentNode.removeChild(typingIndicatorWrapper);
            //     }
            // }, 2000);
        }
    
        return typingIndicatorWrapper; // Return the typing indicator element for later removal
    };

    // Close chat window
    Athena.prototype.closeChat = function () {
       
        this.options.isOpen = false;
        if (this.chatBox) {
            this.chatBox.style.visibility = "hidden"
        }
        this.initChat();
        // }
    };

    // Extend the global object with the Athena function
    window.Athena = Athena;
})();