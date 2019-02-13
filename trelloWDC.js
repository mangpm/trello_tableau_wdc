(function () {
    // Create the Tableau Connector Object
    var myConnector = tableau.makeConnector();

    // Define schemas
    myConnector.getSchema = function (schemaCallback) {
        //Board schema
        var board_cols = [{
            id: "id",
            alias: "Board ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "name",
            alias: "Board Name",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "descdata",
            alias: "Board Description",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "pinned",
            alias: "Is Board Pinned",
            dataType: tableau.dataTypeEnum.bool
          }, {
            id: "url",
            alias: "Board URL",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "background",
            alias: "Board Background",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "backgroundImage",
            alias: "Board Background Image",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "selfJoin",
            alias: "Can Self Join Board",
            dataType: tableau.dataTypeEnum.bool
          }, {
            id: "canBePublic",
            alias: "Can Be Public",
            dataType: tableau.dataTypeEnum.bool
          }, {
            id: "canBePrivate",
            alias: "Can be Private",
            dataType: tableau.dataTypeEnum.bool
          }, {
            id: "canInvite",
            alias: "Can Invite",
            dataType: tableau.dataTypeEnum.bool
          }, {
            id: "dateLastActivity",
            alias: "Last Activity Date",
            dataType: tableau.dataTypeEnum.datetime
          }, {
            id: "dateLastView",
            alias: "Last View Date",
            dataType: tableau.dataTypeEnum.datetime
          }
        ];

        var boardTableSchema = {
            id: "boardDataTable",
            alias: "Board Data",
            columns: board_cols
        };

      //List schema
        var list_cols = [{
            id: "id",
            alias: "List ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "name",
            alias: "List Name",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "closed",
            alias: "Is List Closed",
            dataType: tableau.dataTypeEnum.bool
          }, {
            id: "idBoard",
            alias: "Board ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "pos",
            alias: "List Position",
            dataType: tableau.dataTypeEnum.int
          }
        ];

        var listTableSchema = {
            id: "listDataTable",
            alias: "List Data",
            columns: list_cols
        };

      //Card schema
        var card_cols = [{
            id: "id",
            alias: "Card ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "name",
            alias: "Card Name",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "closed",
            alias: "Is Card Closed",
            dataType: tableau.dataTypeEnum.bool
          }, {
            id: "dateLastActivity",
            alias: "Last Activity Date",
            dataType: tableau.dataTypeEnum.datetime
          }, {
            id: "desc",
            alias: "Description",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idBoard",
            alias: "Board ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idList",
            alias: "List ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "pos",
            alias: "Card Position",
            dataType: tableau.dataTypeEnum.float
          }, {
            id: "due",
            alias: "Card Due",
            dataType: tableau.dataTypeEnum.bool
          }, {
            id: "dueComplete",
            alias: "Card Due Complete",
            dataType: tableau.dataTypeEnum.bool
          }
        ];

        var cardTableSchema = {
            id: "cardDataTable",
            alias: "Card Data",
            columns: card_cols
        };

      // Custom Fields - Board Level schema
        var custFieldsBL_cols = [{
            id: "id",
            alias: "Custom Field ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "name",
            alias: "Custom Field Name",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "type",
            alias: "Custom Field Type",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idModel",
            alias: "Board ID",
            dataType: tableau.dataTypeEnum.string
          }
        ];

        var custFieldsBLTableSchema = {
            id: "custFieldsBLDataTable",
            alias: "Custom Fields - Board Level Data",
            columns: custFieldsBL_cols
        };

      // Custom Fields - List Options schema
        var custFieldsOL_cols = [ {
            id: "optionId",
            alias: "Option ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "optionValue",
            alias: "Option Value",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "optionColor",
            alias: "Option Color",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idCustomField",
            alias: "Custom Field ID",
            dataType: tableau.dataTypeEnum.string
          }
        ];

        var custFieldsOLTableSchema = {
            id: "custFieldsOLDataTable",
            alias: "Custom Fields - List Options Data",
            columns: custFieldsOL_cols
        };

      // Custom Fields - Card Level schema
        var custFieldsCL_cols = [ {
            id: "id",
            alias: "ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idValue",
            alias: "Custom Field Value:ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idValueText",
            alias: "Custom Field Value:Text",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idValueNumber",
            alias: "Custom Field Value:Number",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idValueDate",
            alias: "Custom Field Value:Date",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idCustomField",
            alias: "Custom Field ID",
            dataType: tableau.dataTypeEnum.string
          }, {
            id: "idModel",
            alias: "Model ID",
            dataType: tableau.dataTypeEnum.string
          }
        ];

        var custFieldsCLTableSchema = {
            id: "custFieldsCLDataTable",
            alias: "Custom Fields - Card Level Data",
            columns: custFieldsCL_cols
        };


        schemaCallback([boardTableSchema, listTableSchema, cardTableSchema, custFieldsBLTableSchema, custFieldsOLTableSchema, custFieldsCLTableSchema]);
    };

    // Download data from Trello API
    myConnector.getData = function(table, doneCallback) {
        var apikey = JSON.parse(tableau.connectionData).apikey,
            token = JSON.parse(tableau.connectionData).token,
            boardid = JSON.parse(tableau.connectionData).boardid;

        var apiCall = "https://trello.com/1/boards/" + boardid + "?fields=all&actions=all&action_fields=all&actions_limit=1000&cards=all&card_fields=all&card_attachments=true&lists=all&list_fields=all&members=all&member_fields=all&checklists=all&checklist_fields=all&customFields=true&card_customFieldItems=true&&organization=false&key=" + apikey + "&token=" + token;

        $.getJSON(apiCall, function(resp) {
            var tableData = [];

            var i = 0;
            var len = 0;

            //Board Data Table
            if (table.tableInfo.id == "boardDataTable") {
                            tableData.push({
                                    "id": resp.id,
                                    "name": resp.name,
                                    "descData": resp.descData,
                                    "pinned": resp.pinned,
                                    "url": resp.url,
                                    "background": resp.prefs.background,
                                    "backgroundImage": resp.prefs.backgroundImage,
                                    "selfJoin": resp.prefs.selfJoin,
                                    "canBePublic":resp.prefs.canBePublic,
                                    "canBePrivate": resp.prefs.canBePrivate,
                                    "canInvite": resp.prefs.canInvite,
                                    "dateLastActivity": resp.prefs.dateLastActivity,
                                    "dateLastView": resp.prefs.dateLastView
                                  });
                    }

            //List Data Table
            if (table.tableInfo.id == "listDataTable") {
                    for (i = 0, len = resp.lists.length; i < len; i++) {
                            tableData.push({
                                    "id": resp.lists[i].id,
                                    "name": resp.lists[i].name,
                                    "closed": resp.lists[i].closed,
                                    "idBoard": resp.lists[i].idBoard,
                                    "pos": resp.lists[i].pos
                            });
                      }
              }

            //Card Data Table
            if (table.tableInfo.id == "cardDataTable") {
                    for (i = 0, len = resp.cards.length; i < len; i++) {
                            tableData.push({
                                    "id": resp.cards[i].id,
                                    "name": resp.cards[i].name,
                                    "closed": resp.cards[i].closed,
                                    "dateLastActivity": resp.cards[i].dateLastActivity,
                                    "desc": resp.cards[i].desc,
                                    "idBoard": resp.cards[i].idBoard,
                                    "idList": resp.cards[i].idList,
                                    "pos": resp.cards[i].pos,
                                    "due": resp.cards[i].due,
                                    "dueComplete": resp.cards[i].dueComplete
                            });
                      }
              }

            //Custom Fields - Board Level Data Table
            if (table.tableInfo.id == "custFieldsBLDataTable") {
                    for (i = 0, len = resp.customFields.length; i < len; i++) {
                            tableData.push({
                                    "id": resp.customFields[i].id,
                                    "name": resp.customFields[i].name,
                                    "type": resp.customFields[i].type,
                                    "idModel": resp.customFields[i].idModel
                            });
                      }
              }

            //Custom Fields - List Options Data Table
            if (table.tableInfo.id == "custFieldsOLDataTable") {
              resp.customFields.forEach(function(field) {
                if (typeof field.options !== 'undefined') {
                  field.options.forEach(function(option) {
                    tableData.push({
                      "optionId": option.id,
                      "optionValue": option.value.text,
                      "optionColor": option.color,
                      "idCustomField": option.idCustomField
                    })
                  })
                }
              })
            }

          //Custom Fields - Card Level Data Table
          if (table.tableInfo.id == "custFieldsCLDataTable") {
            resp.cards.forEach(function(card) {
              if (typeof card.customFieldItems !== 'undefined') {
                card.customFieldItems.forEach(function(field) {
                  var data = {}
                  data['id'] = field.id
                  data['idCustomField'] = field.idCustomField
                  data['idModel'] = field.idModel
                  if (typeof field.idValue !== 'undefined') {
                    data['idValue'] = field.idValue
                  }
                  if (typeof field.value !== 'undefined') {
                    if (typeof field.value.text !== 'undefined') {
                      data['idValueText'] = field.value.text
                    }
                    if (typeof field.value.number !== 'undefined') {
                      data['idValueNumber'] = field.value.number
                    }
                    if (typeof field.value.date !== 'undefined') {
                      data['idValueDate'] = field.value.date
                    }
                  }
                  tableData.push(data)
                })
              }
            })
          }

          table.appendRows(tableData);
          doneCallback();
        });
    };

    // Event (button click) listener with input variables
    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            var api_key_input = document.getElementById("api_key_input").value;
            var api_token_input = document.getElementById("api_token_input").value;
            var board_id_input = document.getElementById("board_id_input").value;
            var credsObj = {
               apikey: api_key_input,
               token: api_token_input,
               boardid: board_id_input
            };

            tableau.connectionData = JSON.stringify(credsObj);
            tableau.connectionName = "Trello Data Feed" ;
            tableau.submit();
        });
    });
})();
