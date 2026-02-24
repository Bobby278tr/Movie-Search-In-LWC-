import { LightningElement, api } from 'lwc';

export default class MovieTile extends LightningElement {
    @api movie;
    @api selectedMovieId;

    clickHandler(event){
        console.log('Movie Tile Clicked', this.movie.imbdID);

        // custom event
        const evnt = new CustomEvent('moveclick', {
            detail: this.movie.imdbID
        });
        this.dispatchEvent(evnt);
    }

    get tileSelected(){
        return this.selectedMovieId === this.movie.imdbID ? 'tile selected' : 'tile';
    }
}