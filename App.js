import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar';
import Raw_data from './data.json';

var map = [];
var loaded = false;
var lightcolormap = [];

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

export default function App() {
	preload();
	var [routeList, setRouteList] = useState([]);
	var [colorList, setColorList] = useState([]);

	var [start, setStart] = useState('');
	var [dest, setDest] = useState('');

	const handleList = () => {};

	//suggestion

	//bfs
	const findRoute = (a, b) => {
		console.log('FIND ROUTE WORKING');
		var max = 1000;
		a = map[a];
		b = map[b];
		if (a === undefined || b === undefined || a.Name === b.Name) {
			// console.error('INPUT NOT WRITE');
			// console.log(a);
			// console.log(b);

			return;
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
				break;
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
		// console.warn('out');
		var cur = parent[b.Name];
		var path = [];
		var color = [];
		path.push(b.Name);
		while (cur !== a.Name && max > 0) {
			// console.log(cur);
			path.push(cur);
			cur = parent[cur];
		}
		path.push(a.Name);
		path.reverse();
		console.log('PATH', path);
		setRouteList(path);

		var color = [];
		var colorMap = [];
		colorMap['BLUE'] = 'blue'; //blue
		colorMap['RED'] = 'red'; //red
		colorMap['PINK'] = '#b279a7'; //pink
		colorMap['VIOLET'] = '#7851a9'; //violet
		lightcolormap['blue'] = 'lightblue'; //blue
		lightcolormap['red'] = '#ff726f'; //red
		lightcolormap['#b279a7'] = '#ffc1cc'; //pink
		lightcolormap['#7851a9'] = '#c54b8c'; //violet

		setColorList([]);
		path.map((station) => {
			color.push(colorMap[map[station].Line]);
		});
		setColorList(color);
	};
	useEffect(() => {
		findRoute(start, dest);
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
				<View style={styles.listHeading}>
					<Text style={styles.listHeadingText}>Route</Text>
				</View>
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
							<Text>{item}</Text>
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
