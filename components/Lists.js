import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
export default class Lists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [{
                name: 'Amy Farha',
                avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                subtitle: 'Vice President'
            },
            {
                name: 'Chris Jackson',
                avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                subtitle: 'Vice Chairman'
            }]
        }
        this.onPress = this.onPress.bind(this);
    }
    onPress() {
        alert('hi');
    }
    render() {
        return (
            <FlatList
                keyExtractor={(item, index) => {
                    return index.toString();
                }}
                data={this.state.list}
                renderItem={({ item }) => {
                    return (<ListItem title={item.name}
                        button
                        onPress={() => this.onPress()}
                        leftAvatar={{ source: { uri: item.avatar_url } }}
                        subtitle={item.subtitle}
                    />)
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => FlatListBasics);
