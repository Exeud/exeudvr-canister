import { Fragment } from 'react';
import LoadingScreen from './components/LoadingScreen';
import { AppWindowInternal, useUnity } from './unity/UnityInterface';

function App () {
	const appWindow = useUnity();
    return (
		<Fragment>
			{!appWindow.isLoaded && <LoadingScreen/>}
			<AppWindowInternal unityContext={appWindow.unityContext} />
		</Fragment>
    );
}
export default App;
