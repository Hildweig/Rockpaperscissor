const app = (function () {

    const choices = [
        {
            name:'rock - red',
            element: `
                      <div class="button-circle-1 red">
                            <div class="button-circle-2 rock"></div>
                            <div class="circle-1"></div>
                            <div class="circle-2"></div>
                            <div class="circle-3"></div>
                      </div>`
        },
        {
            name:'scissor - yellow',
            element: `
                      <div class="button-circle-1 yellow">
                            <div class="button-circle-2 scissor"></div>
                            <div class="circle-1"></div>
                            <div class="circle-2"></div>
                            <div class="circle-3"></div>
                      </div>`
        },
        {
            name:'paper - blue',
            element: `
                      <div class="button-circle-1 blue">
                            <div class="button-circle-2 paper"></div>
                            <div class="circle-1"></div>
                            <div class="circle-2"></div>
                            <div class="circle-3"></div>
                      </div>`
        },
        {
            name:'empty',
            element: `<div class="bot-before-pick"></div>`
        }
    ]
    
    // Elements :
    const container = document.querySelector('.container')
    const modal_container = document.querySelector('.modal-container')
    const rules_btn = document.querySelector('.rules')
    const rules_close_btn = document.querySelector('.rules-close')

    const triangle = document.querySelector('.triangle')
    const buttons_pick = Array.from(document.querySelectorAll('.triangle .button-circle-1'))
    const content_player_pick = document.querySelector('.content-player-pick')
    const player_column = document.querySelector('.player')
    const bot_column = document.querySelector('.bot')
    const play_again_btn = document.querySelector('.play-again')

    // audio 
    const audio = document.querySelector('audio')

    // Here the score text is the one we display on top, and the result is either you win or you lose
    const score_text = document.querySelector('.score-container p')
    const result_text = document.querySelector('.result h1')

    // Variables :

    let score = 0
    let player_choice, bot_choice
    let win = false, lose = false,
    // Hard mode
        win_strikes = 0, lose_strikes = 0
    let choice_element
    let player_picked = false

    // easy mode 
    let player_wins = 0, bot_wins = 0

    // Reset the score 
    const reset_score = function() {
        score = 0;
        score_text.textContent = '0'
    }
    // Function to search for a div button :
    reset_score()

    const search_choice_element = function(name) {
        let element
        choices.forEach(choice => {
            
            if(name.includes(choice.name.split(' - ')[1]) || name.includes(choice.name.split(' - ')[0]))
             {
                element = choice.element
                name = choice.name.split(' - ')[0]
             }
        })
        return {element,name}
    }

    const listen_to_player_choice = function() {
        return new Promise((resolve, reject) => {
            buttons_pick.forEach(button => {
                button.addEventListener('click', (e) => {
                   choice_element = search_choice_element(e.target.className).element
                   player_choice = search_choice_element(e.target.className).name               
                   player_picked = true
                   resolve('Player picked!')
                },{once:true})
            })
        })
    
    }

    const display_player_choice = function(choice_element) {
        // Hide triangle 
        
        return new Promise((resolve, reject) => {
              if (win || lose) {
                  reject('Play another game');
              }
              else {
                triangle.classList.add('disable')

                // Remove old pick from the div :
                let player_old_pick  = document.querySelector('.player div')
                player_column.removeChild(player_old_pick)
                // Add the new one
                player_column.innerHTML += choice_element
        
                display_bot_choice(choices[3].element)
                content_player_pick.classList.add('enable')
                resolve('Displaying player choice successful')
              }
          });
    }

    const display_bot_choice = function(element) {
                     
      // Remove old bot div
      let bot_old_pick = document.querySelector('.bot div')
      bot_column.removeChild(bot_old_pick)

      // replace with empty actual element
      bot_column.innerHTML += element
    }

    const bot_pick = function() {
        
             return new Promise((resolve, reject) =>{
                setTimeout(()=> {
                    bot_choice = choices[Math.floor(Math.random()* (choices.length -1))]
                    console.log(bot_choice)

                    if(typeof bot_choice !== 'undefined') {

                        resolve('Bot has successfully picked')

                   }
                   else {
                       reject('Some error happened')
                   }
                },1000)
                
            })
     

    }

    const add_winning_animation = function(winning_party) {
        const div = document.querySelector(`.${winning_party} div`)
        div.classList.add('end')
    }

    // To win you need a three win streak 
    const play_hard_mode = function() {
        content_player_pick.classList.remove('enable')
        triangle.classList.remove('disable')
        
        content_player_pick.classList.remove('end')
        
        return new Promise((resolve, reject) => {
            listen_to_player_choice().then((message) => {
                console.log(message)
               display_player_choice(choice_element).then((message) => {
                 console.log(message)
                 bot_pick().then((message)=>{
                     display_bot_choice(bot_choice.element)
                     // Calculate score here :
                   
                     
                     let bot_pick =  search_choice_element(bot_choice.name).name,
                         player_pick = player_choice 
                    setTimeout(() => {
                        if(player_pick !== bot_pick) {
                            switch(player_pick) {
                               case 'rock':
                                   if(bot_pick == 'paper') {
                                       score = score - 1
                                       lose_strikes += 1
                                       win_strikes = 0
                                   }
                                   else {
                                       score = score + 1
                                       win_strikes += 1
                                       lose_strikes = 0
                                   }
                                   break;
                               case 'paper':
                                   if(bot_pick == 'scissor') {
                                       score = score - 1
                                       lose_strikes += 1
                                       win_strikes = 0
                                   }
                                   else {
                                       score = score + 1
                                       win_strikes += 1
                                       lose_strikes = 0
                                   }
                                   break;
                               case 'scissor':
                                       if(bot_pick == 'rock') {
                                           score = score - 1
                                           lose_strikes +=1
                                           win_strikes = 0
                                       }
                                       else {
                                           score = score + 1
                                           win_strikes += 1
                                           lose_strikes = 0
                                       }
                                   break;
                            }
                        }
                        score_text.textContent = score
                        score_text.classList.add('animate')
                        setTimeout(()=> {
                                score_text.classList.remove('animate')},500)
                        resolve('Yeay!')
                        if(win_strikes === 3) {
                            win = true
                            result_text.textContent = 'You win'
                            content_player_pick.classList.add('end')
                            add_winning_animation('player')

                        }
                        else if(lose_strikes === 3 ) {
                            lose = true
                            result_text.textContent = 'You lose'
                            content_player_pick.classList.add('end')
                            add_winning_animation('bot')
                        }
                        else {
                        play_hard_mode()
                        }
                    }, 2000);
                    
                 })
               })
            })
           
           
            
        })
    }

    const play_easy_mode = function() {
        content_player_pick.classList.remove('enable')
        content_player_pick.classList.remove('end')
        triangle.classList.remove('disable')
        
       
        return new Promise((resolve, reject) => {
            listen_to_player_choice().then((message) => {
                console.log(message)
               display_player_choice(choice_element).then((message) => {
                 console.log(message)
                 bot_pick().then((message)=>{
                     display_bot_choice(bot_choice.element)
                     // Calculate score here :
                   
                     
                     let bot_pick =  search_choice_element(bot_choice.name).name,
                         player_pick = player_choice 
                    setTimeout(() => {
                        if(player_pick !== bot_pick) {
                            switch(player_pick) {
                               case 'rock':
                                   if(bot_pick == 'paper') {
                                       score = score - 1
                                       bot_wins +=1
                                   }
                                   else {
                                       score = score + 1
                                       player_wins +=1
                                   }
                                   break;
                               case 'paper':
                                   if(bot_pick == 'scissor') {
                                       score = score - 1
                                       bot_wins +=1
                                   }
                                   else {
                                       score = score + 1
                                       player_wins +=1
                                   }
                                   break;
                               case 'scissor':
                                       if(bot_pick == 'rock') {
                                           score = score - 1
                                           bot_wins +=1
                                       }
                                       else {
                                           score = score + 1
                                           player_wins += 1
                                       }
                                   break;
                            }
                        }
                        score_text.textContent = score
                        score_text.classList.add('animate')
                        setTimeout(()=> {
                                score_text.classList.remove('animate')},500)
                        resolve('Yeay!')
                        if(player_wins == 2) {
                            win = true
                            result_text.textContent = 'You win'
                            content_player_pick.classList.add('end')
                            add_winning_animation('player')

                        }
                        else if(bot_wins == 2) {
                            lose = true
                            result_text.textContent = 'You lose'
                            content_player_pick.classList.add('end')
                            add_winning_animation('bot')
                        }
                        else {
                        play_easy_mode()
                        }
                    }, 2000);
                    
                 })
               })
            })
           
           
            
        })
    }
    
    // add click event to show the modal
rules_btn.addEventListener('click', () => {

    container.classList.toggle('disable')
    rules_btn.style.visibility = 'hidden'
    modal_container.classList.toggle('show')
})

rules_close_btn.addEventListener('click', () => {
    container.classList.toggle('disable')
    modal_container.classList.toggle('show')
    rules_btn.style.visibility = 'visible'
})



play_again_btn.addEventListener('click', (e) => {
        win_strikes = 0
        lose_strikes = 0
        player_wins = 0
        bot_wins = 0
        win = false
        lose = false 
        score = 0
        score_text.textContent = '0'
        content_player_pick.classList.remove('end')
        play_easy_mode()
    })

    audio.play()
    audio.loop = true
    play_easy_mode()

})()