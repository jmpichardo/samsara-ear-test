import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

declare var AudioContext;
declare var webkitAudioContext;

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  //constructor() { }

   
   /**
    * Object for handling user feedback with 
    * Ionic's LoadingController API methods
    */
   private _PRELOADER           : any;



   /**
    * Object for decoded audio data
    */
   private _TRACK               : any    = null;



   /**
    * Object for decoded audio data
    */
   private _AUDIO               : any;



   /**
    * Object for handling audio buffer data
    */
   private _SOURCE              : any;



   /**
    * Object for handling audio context 
    */
   private _CONTEXT             : any    = new (AudioContext || webkitAudioContext)();



   /**
    * Object for handling audio volume changes
    */
   private _GAIN                : any    = null;

   private _OSCILLATOR          : any    = null;

   private _MAXFREQ              : any    =  6000;
   private _MAXOSCILLATORVAL     : any    = 200;

   private _ISSOUNDCHECK         : boolean   = false;


   private _PANNER              : any    = null; 
   private _pannerOptions        : any    = null; 


   constructor(public http      : HttpClient,
               private _LOADER  : LoadingController) 
   { }




   /**
    *
    * Load the requested track
    *
    * @method loadSound
    * @param track {String} The file path of the audio track to be loaded
    * @return {none}
    */
   loadSound(track : string) : void
   {      
      //this.displayPreloader('Loading track...');
      console.log("AUDIO loadSound")
      console.log(track) 
      this.http.get(track, { responseType: 'arraybuffer' })
      .subscribe((arrayBufferContent : any) =>
      {
         this.setUpAudio(arrayBufferContent);         
      });
   }




   /**
    *
    * Decode the downloaded audio data / set up playback
    *
    * @method setUpAudio
    * @param bufferedContent {object} The downloaded audio data
    * @return {none}
    */
   setUpAudio(bufferedContent : any) : void
   {
      console.log("AUDIO setUpAudio") 
      console.log(this._CONTEXT)
      this._CONTEXT.decodeAudioData(bufferedContent, (buffer : any) =>
      {
         
         this._AUDIO         = buffer;
         this._TRACK         = this._AUDIO;
         this.playSoundTrack(this._TRACK);
      });
   }




   /**
    *
    * Play the decoded audio data
    *
    * @method playSoundTrack
    * @param track {object} The decoded audio data
    * @return {none}
    */
   playSoundTrack(track : any) : void
   {      
      console.log("AUDIO playSoundTrack")
      if (!this._CONTEXT.createGain)
      {
         this._CONTEXT.createGain   = this._CONTEXT.createGainNode;
      }
      if (!this._CONTEXT.createOscillator)
      {
         console.log("OPS")
         this._CONTEXT.createOscillator   = this._CONTEXT.createOscillatorNode;
      }

      this._SOURCE                  = this._CONTEXT.createBufferSource();
      this._GAIN                    = this._CONTEXT.createGain();
      this._OSCILLATOR              = this._CONTEXT.createOscillator();     
      this._pannerOptions           = {pan: 0};
      this._PANNER                  = this._CONTEXT.createPanner(this._pannerOptions);

      console.log(this._OSCILLATOR);
      console.log(this._GAIN);
      console.log(this._PANNER);

      this._SOURCE.buffer           = track;

      this._SOURCE.connect(this._GAIN);
      //this._GAIN.connect(this._CONTEXT.destination);
      this._GAIN.connect(this._PANNER);
      this._PANNER.connect(this._CONTEXT.destination);

      console.log("AUDIO worked")
      
      this._ISSOUNDCHECK = false;
      this._SOURCE.start(0);
      this.hidePreloader();
   }

   /**
    *
    * Play the audio test
    *
    * @method playSoundTest
    * @param 
    * @return {none}
    */
    playSoundTest() : void
    {      
       console.log("AUDIO playSoundTrack")
       if (!this._CONTEXT.createGain)
       {
          this._CONTEXT.createGain   = this._CONTEXT.createGainNode;
       }
       if (!this._CONTEXT.createOscillator)
       {
          console.log("OPS")
          this._CONTEXT.createOscillator   = this._CONTEXT.createOscillatorNode;
       }
 
       this._SOURCE                  = this._CONTEXT.createBufferSource();
       this._GAIN                    = this._CONTEXT.createGain();
       this._OSCILLATOR              = this._CONTEXT.createOscillator();     
       this._pannerOptions           = {pan: 0};
       this._PANNER                  = this._CONTEXT.createPanner(this._pannerOptions);
 
       console.log(this._OSCILLATOR);
       console.log(this._GAIN);
       console.log(this._PANNER);

       this._OSCILLATOR.connect(this._GAIN);
       this._GAIN.connect(this._PANNER);
       this._PANNER.connect(this._CONTEXT.destination);
 
       console.log("AUDIO worked")
       
       this._OSCILLATOR.detune.value = 100; // value in cents
       this._OSCILLATOR.start(0);
      
       this._ISSOUNDCHECK = true;
       this.hidePreloader();
    }



   /**
    *
    * Stop playback of audio data
    *
    * @method stopSound
    * @return {none}
    */
   stopSound() : void
   {
      console.log('AUDIO stopSound');
      if (!this._SOURCE.stop)
      {
         this._SOURCE.stop = this._SOURCE.noteOff;
      }
      if ( this._ISSOUNDCHECK)
         this._OSCILLATOR.stop(0);
      else
         this._SOURCE.stop(0);
   }




   /**
    *
    * Handle user feedback while data is being loaded
    * and parsed
    *
    * @method displayPreloader
    * @param p_message {String} Message for user feedback
    * @return {none}
    */
   displayPreloader(p_message : string) : void
   {
      this._PRELOADER = this._LOADER.create({
         message: p_message,
         duration: 2000
      })
      
      this._PRELOADER.present();
   }




   /**
    *
    * Remove user feedback after data has been loaded
    * and parsed
    *
    * @method hidePreloader
    * @return {none}
    */
   hidePreloader() : void
   {
      //this._PRELOADER.dismiss();
   }




   /**
    *
    * Handle volume control
    *
    * @method changeVolume
    * @param value {Object}      Audio Volume values
    * @return {none}
    */
   changeVolume(volume : any) : void
   {
      console.log('AUDIO changeVolume');
      console.log(volume);
      //let percentile : number    = parseInt(volume.value) / parseInt(volume.max);
      let percentile : number    = parseInt(volume) / 100;
      // A straightforward use of the supplied value sounds awful
      // so we're using a fraction of the supplied value to
      // handle this situation
      this._GAIN.gain.value      = percentile * percentile;
   }


   /**
    *
    * Handle pan control
    *
    * @method changePan
    * @param value {Object}      Audio Pan values
    * @return {none}
    */
    changePan(pan : any) : void
    {
       console.log('AUDIO changePan');
       console.log(pan);
       this._PANNER.orientationX.value = pan;
       this._PANNER.positionX.value = pan;
       console.log(this._PANNER.orientationX.value);
    }

     /**
    *
    * Handle oscillator control
    *
    * @method changeOscillator
    * @param value {Object}      Audio Oscillator values
    * @return {none}
    */
      changeOscillator(value : any) : void
      {
         console.log('AUDIO changePan');
         console.log(value);

         this._OSCILLATOR.frequency.value = (value/this._MAXOSCILLATORVAL) * this._MAXFREQ;

         console.log(this._OSCILLATOR.frequency.value);
      }
 

  
}
