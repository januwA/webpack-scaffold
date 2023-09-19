import s from "./app.module.scss";
import myimg from '@assets/i.jpg'

export default () => {
  // console.log(s);

  return <div>
    <h2 className={s.title}>hello</h2>
    <img src="public/i.jpg" />
    <img src={myimg} />
    <div className={s['px-to-viewport']}>
      <span className={s.title}>title</span>
    </div>
    <div className={s['un-px-to-viewport']}> </div>
    <div className={s.pxToViewport2}></div>
  </div>
};
