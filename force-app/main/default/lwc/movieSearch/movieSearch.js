import { LightningElement, wire } from 'lwc';
import {publish, MessageContext} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';

const DELAY =300;
export default class MovieSearch extends LightningElement {
    selectedType = '';
    selectedSearch = '';
    selectedPageNo = '1';
    isLoading = false;
    delayTimeout;
    serachResult = [];
    selectedMovie = "";

    @wire(MessageContext)
    messageContext;

    get typeOptions() {
        return [
            { label: 'None', value: '' },
            { label: 'Movie', value: 'movie' },
            { label: 'Series', value: 'series' },
            { label: 'Episode', value: 'episode' },
        ];
    }

    handleChange (event){
        let {name, value} = event.target;
        this.isLoading = true;
        if(name === 'type'){
            this.selectedType = value;
        } else if(name === 'search'){
            this.selectedSearch = value;
        } else if(name === 'pageno'){
            this.selectedPageNo = value;
        }
        // for debouncing to make less api call and to make sure that the api is not hit after evry key entered and have a delay of around 300 before api is hit
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(()=>{
            this.searchMovie();
        }, DELAY)
    }

    // this method will seach for the entered movie/series/episode
    async searchMovie(){
        const url = `https://www.omdbapi.com/?s=${this.selectedSearch}&type=${this.selectedType}&page=${this.selectedPageNo}&apikey=b0a83250`;
        const res = await fetch(url);
        const data = await res.json();
        console.log('Movie Search Output', data);
        this.isLoading = false;
        if(data.Response === 'True'){
            this.serachResult = data.Search;
        }
    }

    get displaySearchResult(){
        return this.serachResult.length > 0 ?true : false;
    }

    movieSelectedHandler(event){
        this.selectedMovie = event.detail;
        const payload = {moveId: this.selectedMovie};
        publish(this.messageContext, MOVIE_CHANNEL, payload);
    }
}