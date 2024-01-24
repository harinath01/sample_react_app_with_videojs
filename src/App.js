import { VideoPlayer } from "./VideoPlayer";
import './base.css'

function App() {
  return (
    <div className="center-container">
      <VideoPlayer width={640} height={360}/>
    </div>
  );
}

export default App;
