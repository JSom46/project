import { StyleSheet, StatusBar } from "react-native"
import { withOrientation } from "react-navigation";

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
    },

    title: {
        fontSize: 32,
        textAlign: "center",
        color: "black",
        marginBottom: 4,
    },
});

const stylesMap = StyleSheet.create({
    callout: {
        width: 150,
        height: 150,
        paddingBottom: 10,
    },

    calloutTitle: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
        marginBottom: 4,
    },
});

const stylesAnnouncements = StyleSheet.create({
    listContainer: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
    },

    announcementListItem: {
        backgroundColor: 'white',
        padding: 4,
        paddingVertical: 8,
        marginVertical: 1,
        marginHorizontal: 8,
        borderBottomWidth: 1,
        borderRightWidth: 2,
        borderColor: 'lightgray',
        flex: 1,
        flexDirection: "row"
    },

    announcementListItemTitle: {
        fontSize: 24,
    },

    announcementListItemPhoto: {
        width: 100,
        height: 100,
        marginRight: 8,
    },

    announcementContainer: {
        flex: 1,
    },

    announcementTitle: {
        fontSize: 32,
        textAlign: "center",
        color: "black",
    },

    announcementPhoto: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        marginVertical: 8,
    }
});


export {stylesAuth, stylesHome, stylesAnnouncements, stylesMap};