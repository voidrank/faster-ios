
/**
 * faster
 * author: lancy
 * team: Excited!
 */
'use strict';

var React = require('react-native');
var Button = require("react-native-button");
var {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    AlertIOS,
    ListView,
    Image,
    ScrollView,
    TouchableHighlight,
    } = React;

console.log(123);

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var fasterios = React.createClass({


    poll: function(){
        fetch('http://100.101.102.103:8000/all?cache=' + (new Date()).getTime())
            .then((response) => response.text())
            .then((responseText) => {
                var responseJson = JSON.parse(responseText);
                for (var i = 0; i < responseJson.channels[0].messages.length; ++i)
                    responseJson.channels[0].messages[i].content = JSON.parse(responseJson.channels[0].messages[i].content);
                responseJson.channels[0].messages.reverse();
                this.setState({dataSource: ds.cloneWithRows(responseJson.channels[0].messages)})
                    .done();
            })
            .catch((error) => {
                AlertIOS.alert(responseText.channels[0]);
            });
    },

    getInitialState: function() {
        setInterval(this.poll, 1000);

        return {
            dataSource: ds.cloneWithRows([])
        };
    },

    renderList: function(rowData) {
        rowData.hasImage = rowData.content.hasOwnProperty("image") && rowData.content.image !== null;
        return (
            <View style={styles.msgShell}>
                <Text style={styles.msgTitle}>{rowData.content.title}</Text>
                <Text style={styles.msgDescription}>{rowData.content.text}</Text>
                <Image source={{uri: rowData.content.image}}
                       style={rowData.hasImage ? styles.msgPic: {}}
                    />
                <Text style={styles.msgTime}>{rowData.content.date}</Text>
                <TouchableHighlight style={styles.msgCopy}>
                    <Text style={styles.msgCopyText}>Copy</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.msgShare}>
                    <Text style={styles.msgShareText}>Share</Text>
                </TouchableHighlight>
            </View>
        );
    },

    render: function () {
        return (
            <ScrollView style={styles.global}>
                <View style={styles.header}></View>
                <TouchableHighlight
                    style={styles.button}
                    >
                    <Text style={styles.buttonText}>Share</Text>
                </TouchableHighlight>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderList}
                    renderHeader={
                        () =>
                        <View style={styles.msgHeader}></View>
                    }
                    />
            </ScrollView>
        );
    }
});

var postMsg = {};

postMsg.onSubmitEditing = function () {
    AlertIOS.alert(
        'Foo Title',
        'My Alert Msg',
        [
            {text: 'Foo', onPress: () => console.log('Foo Pressed!')},
            {text: 'Bar', onPress: () => console.log('Bar Pressed!')},
        ]
    );
};

var styles = StyleSheet.create({

    global: {
        flexDirection: "column",
        backgroundColor: '#191919',
        opacity: 0.9,
    },

    header: {
        flex: 1,
        height: 50,
    },

    button: {

        flex: 0,

        marginHorizontal: 10,

        height: 40,
        backgroundColor: "#2ecc40",
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 16,

        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
        fontWeight: 'bold',
        color: "#ffffff",
    },

    msgTitle: {
        flex: 1,
        borderTopWidth: 10,
        borderTopColor: "#ffffff",
        height: 30,
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
    },

    msgShell: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: "#666666",
        paddingBottom: 10,
        alignItems: "center",
    },

    msgHeader: {
        height: 20
    },

    msgDescription: {
        textAlign: "left",
        color: "#ffffff",
        paddingLeft: 20,
        paddingRight: 20,
    },

    msgTime: {
        marginTop: 10,
        textAlign: "right",
        color: "#444444",
        fontSize: 10,
    },

    msgPic: {
        flex: 1,
        resizeMode: "cover",
        height: 300,
        width: 300,
    },

    msgShare: {
        flex: 1,
        alignSelf: "flex-end",
        backgroundColor: "#2ecc40",
        color: "#ffffff",
        alignItems: "center",
        borderRadius: 6,
        height: 20,
        width: 50,
        marginRight: 10,
    },

    msgShareText: {
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontWeight: 'bold',
    },

    msgCopy: {
        flex: 1,
        alignSelf: "flex-end",
        backgroundColor: "#00CCFF",
        alignItems: "center",
        borderRadius: 6,
        height: 20,
        width: 50,
        marginBottom: 10,
        marginRight: 10,
    },

    msgCopyText: {
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontWeight: 'bold',
    },

});

AppRegistry.registerComponent('fasterios', () => fasterios);
