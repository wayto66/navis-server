import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SendNotifyDto } from './dto/send-notify.dto';

@Injectable()
export class NotifyService {
  async send(dto: SendNotifyDto) {
    return;
    const baseUrl = process.env.TERA_URL;
    const url = baseUrl + '/whatsapp/send';
    void axios.post(url, {
      to: '120363021026900866@g.us',
      message: dto.message,
    });
  }
}
