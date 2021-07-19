import { Injectable } from "react-rxbuilder";

@Injectable()
export class CountService {
  static ins: CountService;
  count = 0;
  inc() {
    this.count++;
  }
}
