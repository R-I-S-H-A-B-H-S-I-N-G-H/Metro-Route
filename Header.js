import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header({ title }) {
	return (
		<View style={styles.headerWrapper}>
			<Text style={styles.headerText}>{title}</Text>
		</View>
	);
}
var styles = StyleSheet.create({
	headerWrapper: {
		height: 100,
		backgroundColor: 'orange',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingBottom: 0,
	},
	headerText: {
		backgroundColor: 'darkorange',
		fontSize: 35,
		paddingVertical: 2,
		paddingHorizontal: 10,
		fontWeight: 'bold',
		letterSpacing: 1,
		color: 'white',
		borderWidth: 2,
		borderColor: 'red',
		borderRadius: 10,
	},
});
