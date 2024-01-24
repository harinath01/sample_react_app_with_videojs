import './base.css'

export const VideoPlayer = ({ width, height }) => {
    const style = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#eee'
    };    


    return (
        <div style={style} className='center-container'>
            <h1>Hello world</h1>
        </div>);
};