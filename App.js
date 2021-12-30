import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Raw_data from './assets/data.json';

var map = [];
var loaded = false;
var lightcolormap = [];
var colorMap = [];
colorMap['BLUE'] = 'blue'; //blue
colorMap['RED'] = 'red'; //red
colorMap['PINK'] = '#fc6c85'; //pink
colorMap['VIOLET'] = '#4C2881'; //violet
colorMap['MAGENTA'] = '#ff00ff'; //magenta
colorMap['YELLOW'] = '#b08160'; //yellow

lightcolormap['blue'] = 'lightblue'; //blue
lightcolormap['red'] = '#ff726f'; //red
lightcolormap['#fc6c85'] = '#ffc1cc'; //pink
lightcolormap['#4C2881'] = '#9A6DBE'; //violet
lightcolormap['#ff00ff'] = '#f1a7fe'; //magenta
lightcolormap['#b08160'] = '#fada5f'; //yellow

export default function App() {
	preload();
	var [routeList, setRouteList] = useState([]);
	var [colorList, setColorList] = useState([]);

	var [start, setStart] = useState('');
	var [dest, setDest] = useState('');

	const handleList = () => {};

	//suggestion

	//bfs

	useEffect(() => {
		var path = findRoute(start, dest, routeList);
		setRouteList(path);
		setColorList(populateColordata(path));
	}, [start, dest]);

	return (
		<View style={styles.wholeView}>
			<Header title={'METRO ROUTE'} />
			<SearchBar
				placeHolder={'From Station'}
				station={start}
				textHandler={(text) => {
					setRouteList([]);
					setStart(text);
				}}
			/>

			<SearchBar
				station={dest}
				placeHolder={'To Station'}
				textHandler={(text) => {
					setRouteList([]);
					setDest(text);
				}}
			/>
			<View style={[styles.routeList]}>
				<TouchableOpacity
					style={styles.listHeading}
					onPress={() => {
						var temp = start;
						setStart(dest);
						setDest(temp);
						console.log('ROUTE SWAPPED');
					}}
				>
					<Text style={styles.listHeadingText}>Route</Text>
				</TouchableOpacity>
				<FlatList
					data={routeList}
					renderItem={({ item, index }) => (
						<View
							style={[
								styles.routeListItem,
								{
									backgroundColor: lightcolormap[colorList[index]],
									borderWidth: 1.6,
									borderColor: colorList[index],
								},
							]}
							key={(Math.random() * 10).toString + item}
							onPress={() => clickHandler(item)}
						>
							<Text style={[{ fontWeight: 'bold', fontSize: 16 }]}>{item}</Text>
							{index !== 0 &&
							index !== routeList.length - 1 &&
							colorList[index] != colorList[index + 1] ? (
								<View
									style={[
										{
											backgroundColor:
												lightcolormap[colorMap[map[routeList[index + 1]].Line]],
											paddingHorizontal: 10,
											marginTop: 5,
											paddingVertical: 3,
											borderRadius: 10,
											borderWidth: 2,
											borderColor: colorMap[map[routeList[index + 1]].Line],
										},
									]}
								>
									<Text
										style={[
											{
												color: colorMap[map[routeList[index + 1]].Line],
												fontWeight: 'bold',
											},
										]}
									>
										CHANGE HERE FOR {map[routeList[index + 1]].Line} LINE
									</Text>
								</View>
							) : (
								<View></View>
							)}
						</View>
					)}
				/>
			</View>
		</View>
	);
}
var styles = StyleSheet.create({
	wholeView: {
		flex: 1,
		backgroundColor: 'lightslategrey',
	},
	Submitbutton: {
		padding: 15,
		alignItems: 'center',
		borderWidth: 2,
		borderColor: 'green',
		backgroundColor: 'chartreuse',
	},
	SubmitbuttonText: {
		fontSize: 25,
		fontWeight: 'bold',
	},
	routeList: {
		flex: 1,
		borderWidth: 2,
		paddingVertical: 5,
		borderRadius: 10,
		borderColor: 'green',
		backgroundColor: 'orange',
		margin: 10,
	},
	listHeading: {
		backgroundColor: 'darkorange',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		marginHorizontal: '30%',
		borderColor: 'red',
		borderWidth: 1,
		borderRadius: 10,
	},
	listHeadingText: {
		fontSize: 25,
		fontWeight: 'bold',
		color: 'white',
	},

	routeListItem: {
		margin: 2,
		marginHorizontal: 5,
		padding: 15,
		alignItems: 'center',
		borderRadius: 10,
	},
});

const preload = () => {
	if (loaded) {
		console.log('MAP IS ALREADY FULL');
		return;
	}
	loaded = true;
	// map = [];
	var data = Raw_data['stations'];
	for (var i = 0; i < data.length; i++) {
		var station = data[i];
		map[station.Name] = station;
	}
};

const findRoute = (station_a, station_b, rList) => {
	console.log('FIND ROUTE WORKING');
	var max = 1000;
	a = map[station_a];
	b = map[station_b];
	if (a === undefined || b === undefined || a.Name === b.Name) {
		// console.error('INPUT NOT WRITE');
		// console.log(a);
		// console.log(b);

		return [];
	}
	if (rList !== undefined && rList.length !== 0) {
		if (rList[0] === station_b && rList[rList.length - 1] === station_a) {
			
			rList.reverse();
			return rList;
		}
	}

	// console.log('START : ', a);
	// console.log('END : ', b);

	// bfs algo
	// return;
	var parent = [];
	var q = [];
	var visited = [];
	q.push(a);
	while (q.length > 0) {
		var ele = q.shift();
		// console.log('ele : ', ele);
		max--;
		if (ele === b) {
			// console.log('FOUND');
			max = 1000;
		}
		if (max < 0) {
			console.log('max ', max);
			return null;
		}
		visited[ele.Name] = true;
		var neighbour = ele.Neighbours;
		// console.log('neighbours : ', neighbour);
		// console.log('length : ', neighbour.length);
		for (var i = 0; i < neighbour.length; i++) {
			max--;
			if (max < 0) {
				return null;
			}
			var n = map[neighbour[i]];
			// console.log('n : ', n);
			if (n === undefined) {
				return;
			}
			if (visited[n.Name] !== true) {
				parent[n.Name] = ele.Name;
				visited[n.Name] = true;
				q.push(n);
			}
		}
	}
	// return [];
	var cur = parent[b.Name];
	var path = [];
	path.push(b.Name);
	while (cur !== a.Name && max > 0) {
		path.push(cur);
		cur = parent[cur];
	}
	path.push(a.Name);
	path.reverse();
	return path;
};
const populateColordata = (path) => {
	if (path === undefined || path.length == 0) {
		return [];
	}
	var color = [];
	path.map((station) => {
		color.push(colorMap[map[station].Line]);
	});

	//fixing junctions
	for (var i = 1; i < color.length - 1; i++) {
		var pre = color[i - 1];
		var next = color[i + 1];
		if (pre == next) {
			color[i] = pre;
		}
	}
	color[0] = color[1];
	color[color.length - 1] = color[color.length - 2];
	return color;
};
