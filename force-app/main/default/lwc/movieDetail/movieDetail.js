import { LightningElement, wire } from 'lwc';
import {subscribe, MessageContext, unsubscribe, APPLICATION_SCOPE} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';

export default class MovieDetail extends LightningElement {
    @wire(MessageContext)
    messageContext;
    subscription = null;
    movieId='';

    connectedCallback(){
        this.subscribeToMessageChannel();
    }

    disconnectedCallback(){
        this.unSubscribeToMessageChannel();
    }
    
    subscribeToMessageChannel(){
        if(!this.subscription){
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message),
                {scope: APPLICATION_SCOPE}
            );
        }
    }

    handleMessage(message){
        let movieId = message.moveId;
        console.log('Movie Id', movieId);
    }

    unSubscribeToMessageChannel(){
        if(this.subscription){
            unsubscribe(this.subscription);
            this.subscription = null;
        }
    }
    
}