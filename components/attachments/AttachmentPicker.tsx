import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";


export interface SelectedFile {

  uri: string;

  name: string;

  type: string;

}



interface Props {

  files: SelectedFile[];

  setFiles: (
    files: SelectedFile[]
  ) => void;

}



export default function AttachmentPicker({
  files,
  setFiles,
}: Props) {



  const pickImage = async () => {


    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        allowsMultipleSelection: true,

        selectionLimit: 3 - files.length,

        quality: 0.7,

      });



    if (!result.canceled) {


      const selected =
        result.assets.map(
          (asset) => ({

            uri: asset.uri,

            name:
              asset.fileName ||
              `image-${Date.now()}.jpg`,

            type:
              asset.mimeType ||
              "image/jpeg"

          })
        );


      setFiles([
        ...files,
        ...selected
      ]);

    }

  };




  const pickDocument = async () => {


    const result =
      await DocumentPicker.getDocumentAsync({

        type: [

          "application/pdf",

          "application/msword",

          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        ],

        multiple: true,

      });



    if (
      !result.canceled
    ) {


      const selected =
        result.assets.map(
          (file) => ({

            uri: file.uri,

            name: file.name,

            type:
              file.mimeType ||
              "application/octet-stream"

          })
        );



      setFiles([

        ...files,

        ...selected.slice(
          0,
          3 - files.length
        )

      ]);

    }


  };




  const removeFile = (
    index:number
  )=>{

    setFiles(
      files.filter(
        (_,i)=>i !== index
      )
    );

  };



return (

<View>

<Button
title="Choose Images"
onPress={pickImage}
/>


<Button
title="Choose PDF / DOC"
onPress={pickDocument}
/>



<Text style={styles.title}>
Attachments ({files.length}/3)
</Text>


{
files.map(
(file,index)=>(

<Text
key={index}
onPress={()=>
removeFile(index)
}
style={styles.file}
>

❌ {file.name}

</Text>

)
)

}


</View>

);


}



const styles =
StyleSheet.create({

title:{
marginTop:10,
fontWeight:"bold"
},

file:{
marginTop:5,
color:"blue"
}

});