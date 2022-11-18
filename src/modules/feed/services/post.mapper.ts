import { DateTime } from 'luxon';
import { MessageAudioElement, MessageElement, MessageImageElement, MessageTextElement, MessageVideoElement, MessageYoutubeElement, Post, PostData, PostMessage } from '../post.model';

export class PostMapper {
  map(data: PostData): Post {
    let date = new Date(data.createdAt);
    return {
      ...data,
      message: this.parseMessage(`${data.message} ${data.attachementUrl ? data.attachementUrl : ''}`.trim()),
      //createdAt : (date.getDate()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '/' + ((date.getMonth() + 1)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '/' + date.getFullYear() + ' à ' + (date.getHours()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ':' + (date.getMinutes()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ':' + (date.getSeconds()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    }
  }
  private parseMessage(message: string): PostMessage {
    
    // TODO rajouter png jpg et gif
    const pictureRegex = /http[s]?:\/\/\S+?\.(jpeg|jpg|png|gif)/gmi;

     // TODO mp4,wmv,flv,avi|wav,wav
    const videoRegex = /http[s]?:\/\/\S+?\.(?:mp4|wmv|flv|avi|wav)/gmi;

     // TODO mp3,ogg,wav
    const audioRegex = /http[s]?:\/\/\S+?\.(?:mp3|ogg|wav)/gmi;

    const youtubeRegex = /(http[s]?:\/\/)?www\.(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gmi;
    const attachements: MessageElement[] = [];

    let youtubeList = message.match(youtubeRegex);
    let audioList = message.match(audioRegex);
    let videoList = message.match(videoRegex);
    let pictureList = message.match(pictureRegex);

    youtubeList?.forEach(element => {
      let id = element.split('=')[1];
      attachements.push({
        type: 'youtube',
        videoId: id
      } as MessageYoutubeElement);
    });

    audioList?.forEach(element => {
      attachements.push({
        type: 'audio',
        url: element
      } as MessageAudioElement);
    });

    videoList?.forEach(element => {
      attachements.push({
        type: 'video',
        url: element
      } as MessageVideoElement);
    });

    pictureList?.forEach(element => {
      attachements.push({
        type: 'image',
        url: element
      } as MessageImageElement);
    });

    // const pictureMatche = pictureRegex.exec(message);
    // if (pictureMatche) {
    //  // TODO ajouter un attachement de type image dans attachements
    //  attachements.push({
    //    type: 'image',
    //    url: message
    //  } as MessageImageElement);
    // }

    // const videoMatche = videoRegex.exec(message)
    // if (videoMatche) {
    //  // TODO ajouter un attachement de type video dans attachements
    //  attachements.push({
    //     type: 'video',
    //     url: message
    //   } as MessageVideoElement);
    // }

    // const audioMatche = audioRegex.exec(message)
    // if (audioMatche) {
    //  // TODO ajouter un attachement de type audio dans attachements
    //   attachements.push({
    //     type: 'audio',
    //     url: message
    //   } as MessageAudioElement);
    // }

    // const youtubeMatche = youtubeRegex.exec(message)
    // if (youtubeMatche) {
    //  // TODO ajouter un attachement de type youtube dans attachements
    //  let mes = message.split('=');
    //   attachements.push({
    //     type: 'youtube',
    //     videoId: mes[1]
    //   } as MessageYoutubeElement);
    // }

    return {
      text: {
        type: 'text',
        content: message
      } as MessageTextElement,
      attachements
    };
  }
}
