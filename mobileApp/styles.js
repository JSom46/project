import { StyleSheet, StatusBar } from "react-native"

const stylesAuth = StyleSheet.create({
    back: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        
    },

    card: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'skyblue',
        padding: 20,
        width: '80%',
        borderRadius: 10,
        //borderColor: 'black',
        //borderWidth: 1,
        elevation: 6,
    },

    input: {
        fontSize: 16,
        backgroundColor: 'white',
        margin: 5,
        width: '100%',
    },

    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        borderRadius: 5,
    },

    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
        textTransform: "uppercase",
    },
});

const stylesHome = StyleSheet.create({
    dashboard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const stylesAnnouncements = StyleSheet.create({
    listContainer: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
      },

    announcement: {
        backgroundColor: 'white',
        padding: 4,
        marginVertical: 1,
        marginHorizontal: 8,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: 'lightgray',
    },

    announcementTitle: {
        fontSize: 32,
    },


});


export {stylesAuth, stylesHome, stylesAnnouncements};