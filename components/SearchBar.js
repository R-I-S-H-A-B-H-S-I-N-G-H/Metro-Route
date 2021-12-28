import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import Raw_data from '../assets/data.json';
var stationNamemap = [];
const preload = () => {
	if (stationNamemap.length !== 0) {
		return;
	}

	stationNamemap = [];
	var data = Raw_data['stations'];
	for (var i = 0; i < data.length; i++) {
		var station = data[i];
		stationNamemap.push(station.Name);
	}
};

export default function SearchBar({ placeHolder, station, textHandler }) {
	preload();
	var [stationName, setStation] = useState(station);
	var [suggestionList, setSuggestionList] = useState([]);
	var [listHeight, setListHeight] = useState({});

	const staionChange = (text) => {
		textHandler(text);
		setStation(text);
		setListHeight({});
	};
	const clickHandler = (text) => {
		// console.log('TEXT SELECTED : ', text);
		staionChange(text);
		setSuggestionList([]);
	};
	const changeSuggestion = (text) => {
		setStation(text);
		textHandler(text);

		var hintList = [];
		setSuggestionList([]);
		setListHeight({ height: 0 });
		var stationNames = stationNamemap;

		// console.log('station name lIST ', stationNames);
		// console.log('station name lIST ', stationNamemap);

		if (text === '' || stationNames === undefined) {
			return;
		}
		if (text.length > 0) {
			var regex;
			regex = new RegExp(`${text}`, 'gi');

			hintList = stationNamemap.sort().filter((word) => regex.test(word));

			if (hintList == undefined || hintList.length == 0) {
				return;
			}
			// console.log(hintList);
		} else {
			hintList = [];
			// console.log('text is empty');
		}
		setSuggestionList(hintList);
		if (hintList.length > 0) {
			setListHeight({ height: 150 });
		} // console.log(suggestions);
	};
	useEffect(() => {
		setStation(station);
	}, [station]);
	return (
		<View style={styles.searchWrapper}>
			<TextInput
				value={stationName}
				onChangeText={(text) => changeSuggestion(text)}
				style={styles.search}
				placeholder={placeHolder}
			></TextInput>
			<FlatList
				keyboardShouldPersistTaps="handled"
				style={[styles.suggestionList, listHeight]}
				data={suggestionList}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						key={(Math.random() * 10).toString + item}
						onPress={() => clickHandler(item)}
						style={styles.suggestionListItem}
					>
						<Text key={(Math.random() * 10 + index).toString + item}>
							{item}
						</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}
var styles = StyleSheet.create({
	searchWrapper: {
		backgroundColor: 'orange',
		padding: 10,
	},
	search: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 5,
		fontWeight: 'bold',
		color: 'gray',
		fontSize: 16,
	},
	suggestionList: {},
	suggestionListItem: {
		margin: 1,
		padding: 10,
		backgroundColor: 'lightblue',
		alignItems: 'center',
	},
});
