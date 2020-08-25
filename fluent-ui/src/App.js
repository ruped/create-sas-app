import React, {useEffect} from 'react';
import 'react-toggle/style.css'
import 'toastr/toastr.scss'
import './App.scss';
import {Switch, Route} from 'react-router-dom';
import Home from './pages/home/home'
import Header from './components/header/header'
import Page500 from './pages/Page500/Page500'
import Page404 from './pages/Page404/Page404'
import Portal from './components/portal/portal'
import LoginModal from './components/loginModal/loginModal'
import ApplicationLogs from './pages/applicationLogs/applicationLogs'
import FailedRequests from './pages/failedRequests/failedRequests'
import ErrorLogs from './pages/errorLogs/errorLogs'
import DebugLogs from './pages/debugLogs/debugLogs'
import {Panel, Nav} from '@fluentui/react'
import {useDispatch, useSelector} from 'react-redux';
import ActionTypes from './pages/home/ActionTypes'
import RightPanelFooter from './components/rightPanelFooter/rightPanelFooter'
import RightPanelContent from './components/rightPanelContent/rightPanelContent'
import ProjectList from './pages/projectList/projectList'
import {
	createTheme,
	Customizations,
	Fabric,
} from '@fluentui/react';
import appSettings from './appSettings'
import ProjectProperties from './pages/projectProperties/projectProperties';



const myTheme = createTheme({
	palette: {
		themePrimary: '#04304B',
		themeLighterAlt: '#eff6fc',
		themeLighter: '#deecf9',
		themeLight: '#c7e0f4',
		themeTertiary: '#71afe5',
		themeSecondary: '#2b88d8',
		themeDarkAlt: '#106ebe',
		themeDark: '#005a9e',
		themeDarker: '#004578',
		neutralLighterAlt: '#faf9f8',
		neutralLighter: '#f3f2f1',
		neutralLight: '#edebe9',
		neutralQuaternaryAlt: '#e1dfdd',
		neutralQuaternary: '#d0d0d0',
		neutralTertiaryAlt: '#c8c6c4',
		neutralTertiary: '#a19f9d',
		neutralSecondary: '#605e5c',
		neutralPrimaryAlt: '#3b3a39',
		neutralPrimary: '#323130',
		neutralDark: '#201f1e',
		black: '#000000',
		white: '#ffffff',
	}
});
Customizations.applySettings({theme: myTheme});

function App() {
  const dispatch = useDispatch()
  
  const {projectMetadata} = useSelector(state => state.project)
  const projectUri = projectMetadata?  projectMetadata.uri.split('/').pop() : 'noProject';

	// Set initial window width
	setWindowWidth(dispatch, window.innerWidth)


	useEffect(() => {
		const onResize = () => {
			setWindowWidth(dispatch, window.innerWidth)
		}
		window.addEventListener('resize', onResize)
		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [dispatch])

	const width = useSelector(state => state.home.width)

	const leftPanel = useSelector(state => state.home.leftPanel)
	const navLinkGroups = [
		{
			links: [
				{name: 'SAS Folders', url: '#/projectList', key: 'projectList', icon: 'FolderHorizontal'},
        {name: 'Project properties', url: `#/project/${projectUri}`, key: 'project',  icon: 'AllApps'},
				{name: 'Home', url: '#/', key: 'home', icon: 'home'},
				{
					name: 'GroupTitle',
					links: [
						{
							key: 'ActivityItem',
							name: 'ActivityItem',
						},
						{
							key: 'Breadcrumb',
							name: 'Breadcrumb',
						},
						{
							key: 'Button',
							name: 'Button',
						},
					]
				},
			],
		},
	];
	const rightPanel = useSelector(state => state.home.rightPanel)
	return (
		<Fabric applyThemeToBody>
			<div className="App">
				<Header/>
				<div className={'flex'}>
					<Nav
						className={`nav ${leftPanel || width > appSettings.leftNavBrakPoint ? 'open' : ''}`}
						onLinkClick={e =>  console.log('click', e)}
						selectedKey="key1"
						ariaLabel="Nav basic example"
						groups={navLinkGroups}
					/>
					<Panel
						layerProps={{ styles: { root: { zIndex: 999998 }}}}
						className={'rightPanel'}
						isOpen={rightPanel}
						//isLightDismiss
						// You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
					  //closeButtonAriaLabel="Close"
						//onDismiss={() => setRightPanel(dispatch, false)}
						hasCloseButton={false}
						onRenderFooterContent={()=>{return <RightPanelFooter/>}}
						isFooterAtBottom={true}
					>
						<RightPanelContent/>
					</Panel>
					<div className={'main'}>
						<div className={'mainContainer'}>
							<Switch>
								<Route exact path='/' component={Home}/>
                <Route exact path='/project/:uri' component={ProjectProperties} />
								<Route exact path='/error' component={Page500}/>
								<Route exact path='/applicationLogs' component={ApplicationLogs}/>
								<Route exact path='/errorLogs' component={ErrorLogs}/>
								<Route exact path='/failedRequests' component={FailedRequests}/>
								<Route exact path='/debugLogs' component={DebugLogs}/>
								<Route exact path='/projectList' component={ProjectList}/>
								<Route component={Page404}/>
							</Switch>
						</div>
					</div>
				</div>
				<Portal>
					<LoginModal/>
          
				</Portal>
			</div>
		</Fabric>

	);
}

export default App;


function setWindowWidth(dispatch, width) {
	dispatch({
		type: ActionTypes.SET_WINDOW_WIDTH,
		width
	})
}
