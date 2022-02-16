import { Component } from '@angular/core';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  /**
    * Define the initial volume setting for the application
    */
   public volume         : any     = 100;

   
  /**
    * Define the initial pan  setting for the application
    */
   public pan         : any     = 0;

  /**
    * Define the initial osc setting for the application
    */
   public osc         : any     = 100;


   /**
    * Initial state for audio playback
    */
   public isPlaying      : boolean = false;


   /**
    * Audio data to be used by the application
    * Change these to whatever YOUR audio tracks are!
    */
   public tracks         : any     = [
   										{
   										   artist  : 'Arcane',
                                           name    : 'Season 01',
   										   track   : 'assets/sounds/arcane_01.mp3'
   										},
   										{
                                           artist  : 'Arcane',
   										   name    : 'Season 02',
   										   track   : 'assets/sounds/arcane_02.mp3'
   										},
   										{
                                           artist  : 'Arcane',
   										   name    : 'Season 03',
   										   track   : 'assets/sounds/arcane_03.mp3'
   										},
   									]; 




  constructor(private _AUDIO   : AudioService) 
  {
  }


   /**
    *
    * Load the requested track, determine if existing audio is 
    * currently playing or not
    *
    * @method loadSound
    * @param track {String} The file path of the audio track to be loaded
    * @return {none}
    */
    loadSound(track : string): void
    {
       console.log("loadSound")
       console.log(track)
       if(!this.isPlaying)
       {
          this.triggerPlayback(track);
       }
       else
       {             
          this.isPlaying  = false;
          this.stopPlayback();     
          this.triggerPlayback(track);
       }
    }
 
 
 
    /**
     *
     * Load the requested track using the Audio service
     *
     * @method triggerPlayback
     * @param track {String} The file path of the audio track to be loaded
     * @return {none}
     */
    triggerPlayback(track : string): void
    {
      console.log("triggerPlayback")
      console.log(track)
       this._AUDIO.loadSound(track);
       this.isPlaying  = true;
    }
 
 
 
 
    /**
     *
     * Change playback volume
     *
     * @method changeVolume
     * @param volume {Any} The volume control slider value
     * @return {none}
     */
    changeVolume(volume : any) : void
    {
      console.log("HOME changeVolume");
       console.log(volume);
       this._AUDIO.changeVolume(volume);
    }
 
 
     /**
     *
     * Change playback pan
     *
     * @method changePan
     * @param pan {Any} The pan control slider value
     * @return {none}
     */
      changePan(pan : any) : void
      {
        console.log("HOME changePan");
         console.log(pan);
         this._AUDIO.changePan(pan);
      }

           /**
     *
     * Change playback OSCILLATOR
     *
     * @method changeOscillator
     * @param pan {Any} The oscillator control slider value
     * @return {none}
     */
            changeOscillator(value : any) : void
            {
              console.log("HOME changeOscillator");
               console.log(value);
               this._AUDIO.changeOscillator(value);
            }
      
 
 
 
    /**
     *
     * Stop audio playback
     *
     * @method stopPlayback
     * @return {none}
     */
    stopPlayback() : void
    {
       this.isPlaying  = false;
       this._AUDIO.stopSound();
    }

    /**
     *
     * Start audio playback
     *
     * @method startPlayback
     * @return {none}
     */
     startPlayback() : void
     {        
        this._AUDIO.playSoundTest();
        this.isPlaying  = true;
     }

}
