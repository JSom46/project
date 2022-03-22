import { View, StyleSheet, ScrollView } from "react-native";

import React, { useState, useEffect } from "react";
//table
import { Table, Row } from "react-native-table-component";

function createData(id, title, category, time, description, lat, lng, type) {
  return { id, title, category, time, description, lat, lng, type };
}

const AnnouncementList = ({ navigation }) => {
  const [tableData = [], setTableData] = useState();

  const state = {
    tableHead: ["", "tytul", "Kategoria", "Opis", "Typ", "lat", "lng"],
    widthArr: [40, 80, 80, 100, 80, 40, 40],
  };

  useEffect(() => {
    const fetchData = async () => {
      let url = "http://" + serwer + "/anons/list?page=1";
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const json = await response.json();
        const tabData = [];
        json.list.forEach((element) => {
          const rows = [];
          rows.push(
            element.id,
            element.title,
            element.category === 0 ? "Zaginięcie" : "Znalezienie",
            element.description,
            element.type,
            element.lat,
            element.lng
          );
          tabData.push(rows);
        });
        setTableData(tabData);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);
  //  console.log(tableData);

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
            <Row
              data={state.tableHead}
              widthArr={state.widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              {tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  widthArr={state.widthArr}
                  style={styles.row}
                  textStyle={styles.text}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 70, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 30, backgroundColor: "#E7E6E1" },
});
export default AnnouncementList;
