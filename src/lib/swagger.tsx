import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      "openapi": "3.0.3",
      "info": {
        "title": "HIGHKICK - OpenAPI 3.0",
        "description": "Please note that this API is fresh and flexible and can be extended with nested data to needed extent. If needed, we could add optional nesting, additional fields etc. Contact us for any questions or proposals.",
        "contact": {
          "email": "maksym.b@gamebeats.gg"
        },
        "version": "1.0.0"
      },
      "servers": [
        {
          "url": "https://admin.gamebeats.gg/api"
        }
      ],
      "tags": [
        {
          "name": "tournaments",
          "description": "Tournaments"
        },
        {
          "name": "matches",
          "description": "Matches"
        },
        {
          "name": "games",
          "description": "Games"
        }
      ],
      "paths": {
        "/matches": {
          "get": {
            "tags": [
              "matches"
            ],
            "summary": "Get matches by parameters",
            "description": "Find matches based on optional search criteria, can include games with results as nested data",
            "operationId": "getMatches",
            "parameters": [
              {
                "name": "status",
                "in": "query",
                "description": "Matches status",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "enum": [
                    "ongoing",
                    "finished",
                    "upcoming",
                    "canceled"
                  ]
                }
              },
              {
                "name": "page",
                "in": "query",
                "description": "Pagination parameter - page",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "integer",
                  "default": 1
                }
              },
              {
                "name": "size",
                "in": "query",
                "description": "Pagination parameter - page size",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "integer",
                  "default": 10
                }
              },
              {
                "name": "sortBy",
                "in": "query",
                "description": "Sort field",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "default": "startedAt"
                }
              },
              {
                "name": "sort",
                "in": "query",
                "description": "Sort order",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "default": "asc",
                  "enum": [
                    "asc",
                    "desc"
                  ]
                }
              },
              {
                "name": "tournamentId",
                "in": "query",
                "description": "Tournament ID",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "integer"
                }
              },
              {
                "name": "results",
                "in": "query",
                "description": "Include each match's games with results as nested data or not",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "boolean",
                  "default": false
                }
              },
              {
                "name": "startedFrom",
                "in": "query",
                "description": "Search for matches started from this datetime",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "format": "date-time"
                }
              },
              {
                "name": "startedTo",
                "in": "query",
                "description": "Search for matches started to this datetime (only works with startedFrom)",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "format": "date-time"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "successful operation",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "allOf": [
                          {
                            "$ref": "#/components/schemas/Match"
                          },
                          {
                            "type": "object",
                            "properties": {
                              "games": {
                                "type": "array",
                                "items": {
                                  "allOf": [
                                    {
                                      "$ref": "#/components/schemas/Game"
                                    },
                                    {
                                      "type": "object",
                                      "properties": {
                                        "ufcResultDetails": {
                                          "type": "object",
                                          "$ref": "#/components/schemas/ResultDetails"
                                        },
                                        "winner": {
                                          "type": "object",
                                          "$ref": "#/components/schemas/Competitor"
                                        }
                                      }
                                    }
                                  ]
                                }
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                  "application/xml": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Match"
                      }
                    }
                  }
                }
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        },
        "/tournaments": {
          "get": {
            "tags": [
              "tournaments"
            ],
            "summary": "Get tournaments by parameters",
            "description": "Find tournaments based on optional search criteria",
            "operationId": "getTournaments",
            "parameters": [
              {
                "name": "status",
                "in": "query",
                "description": "Tournaments status",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "enum": [
                    "ongoing",
                    "finished",
                    "upcoming"
                  ]
                }
              },
              {
                "name": "page",
                "in": "query",
                "description": "Pagination parameter - page",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "integer",
                  "default": 1
                }
              },
              {
                "name": "size",
                "in": "query",
                "description": "Pagination parameter - page size",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "integer",
                  "default": 10
                }
              },
              {
                "name": "sortBy",
                "in": "query",
                "description": "Sort field",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "default": "startedAt"
                }
              },
              {
                "name": "sort",
                "in": "query",
                "description": "Sort order",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "default": "asc",
                  "enum": [
                    "asc",
                    "desc"
                  ]
                }
              }
            ],
            "responses": {
              "200": {
                "description": "successful operation",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Tournament"
                      }
                    }
                  },
                  "application/xml": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Tournament"
                      }
                    }
                  }
                }
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        },
        "/games": {
          "get": {
            "tags": [
              "games"
            ],
            "summary": "Get games by parameters",
            "description": "Find games based on optional search criteria",
            "operationId": "getGames",
            "parameters": [
              {
                "name": "status",
                "in": "query",
                "description": "Games status",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "enum": [
                    "ongoing",
                    "finished",
                    "upcoming",
                    "canceled"
                  ]
                }
              },
              {
                "name": "page",
                "in": "query",
                "description": "Pagination parameter - page",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "integer",
                  "default": 1
                }
              },
              {
                "name": "size",
                "in": "query",
                "description": "Pagination parameter - page size",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "integer",
                  "default": 10
                }
              },
              {
                "name": "sortBy",
                "in": "query",
                "description": "Sort field",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "default": "startedAt"
                }
              },
              {
                "name": "sort",
                "in": "query",
                "description": "Sort order",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "default": "asc",
                  "enum": [
                    "asc",
                    "desc"
                  ]
                }
              },
              {
                "name": "matchId",
                "in": "query",
                "description": "Match ID",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "integer"
                }
              },
              {
                "name": "startedFrom",
                "in": "query",
                "description": "Search for games started from this datetime",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "format": "date-time"
                }
              },
              {
                "name": "startedTo",
                "in": "query",
                "description": "Search for games started to this datetime (only works with startedFrom)",
                "required": false,
                "explode": true,
                "schema": {
                  "type": "string",
                  "format": "date-time"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "successful operation",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "allOf": [
                          {
                            "$ref": "#/components/schemas/Game"
                          },
                          {
                            "type": "object",
                            "properties": {
                              "ufcResultDetails": {
                                "type": "object",
                                "$ref": "#/components/schemas/ResultDetails"
                              },
                              "match": {
                                "type": "object",
                                "$ref": "#/components/schemas/Match"
                              },
                              "competitors": {
                                "type": "array",
                                "items": {
                                  "allOf": [
                                    {
                                      "$ref": "#/components/schemas/CompetitorMatchData"
                                    },
                                    {
                                      "type": "object",
                                      "properties": {
                                        "competitor": {
                                          "type": "object",
                                          "$ref": "#/components/schemas/Competitor"
                                        }
                                      }
                                    }
                                  ]
                                },
                                "example": [
                                  {
                                    "competitorId": 3,
                                    "order": 1,
                                    "score": 2,
                                    "competitor": {
                                      "id": 3,
                                      "nickname": "Destroyer",
                                      "image": "link_to_image",
                                      "imageSmall": "https://link_to_image"
                                    }
                                  },
                                  {
                                    "competitorId": 5,
                                    "order": 2,
                                    "score": 3,
                                    "competitor": {
                                      "id": 5,
                                      "nickname": "Punisher",
                                      "image": "link_to_image",
                                      "imageSmall": "https://link_to_small_image"
                                    }
                                  }
                                ]
                              },
                              "tournament": {
                                "type": "object",
                                "properties": {
                                  "name": {
                                    "type": "string",
                                    "example": "Weekly UFC tournament 25"
                                  }
                                }
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                  "application/xml": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Game"
                      }
                    }
                  }
                }
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        }
      },
      "components": {
        "schemas": {
          "Match": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "format": "int64",
                "example": 25
              },
              "tournamentId": {
                "type": "integer",
                "format": "int64",
                "example": 1
              },
              "winnerId": {
                "type": "integer",
                "format": "int32",
                "example": 7,
                "nullable": true
              },
              "format": {
                "type": "string",
                "description": "All matches currently have format SET and numberOfGames = 5. It means every match consists of 5 games and it has score (e.g. 5-0, 2-3 etc.) and we will be able to provide odds for score.",
                "enum": [
                  "SET"
                ]
              },
              "numberOfGames": {
                "type": "integer",
                "format": "int64",
                "example": 5
              },
              "startedAt": {
                "type": "string",
                "format": "date-time"
              },
              "endedAt": {
                "type": "string",
                "format": "date-time",
                "nullable": true
              },
              "status": {
                "type": "string",
                "description": "Match status",
                "example": "ongoing",
                "enum": [
                  "upcoming",
                  "ongoing",
                  "finished",
                  "canceled"
                ]
              },
              "streamChannel": {
                "description": "Stream channel this match is being translated on",
                "type": "string",
                "enum": [
                  "1",
                  "2"
                ]
              }
            },
            "xml": {
              "name": "match"
            }
          },
          "Tournament": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "format": "int64",
                "example": 1
              },
              "name": {
                "type": "string"
              },
              "status": {
                "type": "string",
                "description": "Tournament status",
                "example": "ongoing",
                "enum": [
                  "upcoming",
                  "ongoing",
                  "finished"
                ]
              },
              "startedAt": {
                "type": "string",
                "format": "date-time"
              },
              "endedAt": {
                "type": "string",
                "format": "date-time",
                "nullable": true
              }
            },
            "xml": {
              "name": "tournament"
            }
          },
          "Game": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "format": "int64",
                "example": 10
              },
              "matchId": {
                "type": "integer",
                "format": "int64",
                "example": 25,
                "description": "Relation to Match this game belongs to (many-to-one)"
              },
              "winnerId": {
                "type": "integer",
                "format": "int32",
                "example": 7,
                "nullable": true
              },
              "startedAt": {
                "type": "string",
                "format": "date-time"
              },
              "endedAt": {
                "type": "string",
                "format": "date-time",
                "nullable": true
              },
              "status": {
                "type": "string",
                "description": "Game status",
                "example": "ongoing",
                "enum": [
                  "upcoming",
                  "ongoing",
                  "finished",
                  "canceled"
                ]
              }
            }
          },
          "Competitor": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "format": "int64",
                "example": 10
              },
              "nickname": {
                "type": "string",
                "description": "Player's nickname",
                "example": "Destroyer"
              },
              "name": {
                "type": "string",
                "description": "Player's name",
                "example": "Maksym"
              },
              "surname": {
                "type": "string",
                "description": "Player's surname",
                "example": "Alexandrov"
              },
              "image": {
                "type": "string",
                "description": "Link to player's image",
                "example": "https://link_to_image"
              },
              "imageSmall": {
                "type": "string",
                "description": "Link to player's small image",
                "example": "https://link_to_small_image"
              }
            },
            "xml": {
              "name": "resultDetails"
            }
          },
          "ResultDetails": {
            "type": "object",
            "properties": {
              "gameId": {
                "type": "integer",
                "format": "int64",
                "example": 10,
                "description": "Relation to Game"
              },
              "isDraw": {
                "type": "boolean",
                "description": "Defines if this game finished as a draw",
                "example": false
              },
              "round": {
                "type": "integer",
                "example": 2,
                "description": "Round when game finished (if game went full distance - this will be max round of game)"
              },
              "endTime": {
                "type": "string",
                "example": "02:45",
                "description": "Time of round when game finished (if game went full distance it will be equal '05:00')"
              },
              "endMethod": {
                "type": "string",
                "description": "Defines how the game finished",
                "example": "KO",
                "enum": [
                  "KO",
                  "SUB",
                  "DEC",
                  "SPLIT_DEC"
                ]
              }
            },
            "xml": {
              "name": "resultDetails"
            }
          },
          "CompetitorMatchData": {
            "type": "object",
            "properties": {
              "competitorId": {
                "type": "integer",
                "format": "int64",
                "example": 3
              },
              "order": {
                "type": "integer",
                "example": 1,
                "description": "Order of players listed in particular match"
              },
              "score": {
                "type": "integer",
                "description": "Score of this competitor in particular match",
                "example": 1
              }
            },
            "xml": {
              "name": "competitorMatchData"
            }
          }
        }
      }
    },
  });
  return spec;
};

export const getOddsApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      "openapi": "3.0.3",
      "info": {
        "title": "API documentation for querying predicted odds",
        "version": "1.0.0"
      },
      "tags": [
        {
          "name": "prematch",
          "description": "Odds calculated before a match begins"
        },
        {
          "name": "live",
          "description": "Odds calculated and updated during a match"
        }
      ],
      "paths": {
        "/prematch": {
          "post": {
            "tags": [
              "prematch"
            ],
            "summary": "Retrieve prematch odds",
            "description": "If an empty array is given, all upcoming matches with valid odds are returned.",
            "operationId": "getPrematchOdds",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": [
                        "id",
                        "oddsType"
                      ],
                      "properties": {
                        "id": {
                          "description": "Ids of match",
                          "type": "integer"
                        },
                        "oddsTypes": {
                          "description": "Odds types to return",
                          "type": "array",
                          "items": {
                            "$ref": "#/components/schemas/PrematchOddsType"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful operation",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "integer"
                          },
                          "odds": {
                            "$ref": "#/components/schemas/PrematchOddsResults"
                          }
                        }
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "Invalid PrematchOddsType provided"
              },
              "404": {
                "description": "Matches not found"
              }
            }
          }
        },
        "/prematch/listAvailable": {
          "get": {
            "tags": [
              "prematch"
            ],
            "summary": "List odds available for matches",
            "description": "Returns all available odds types for all upcoming matches with valid odds calculated.",
            "operationId": "listPrematchOdds",
            "responses": {
              "200": {
                "description": "successful operation",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "description": "Id of match",
                            "type": "integer"
                          },
                          "oddsTypes": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/PrematchOddsType"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/live": {
          "post": {
            "tags": [
              "live"
            ],
            "summary": "Retrieve live odds",
            "description": "If an empty array is given, all upcoming matches with valid odds are returned.",
            "operationId": "getLiveOdds",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": [
                        "liveMatch",
                        "oddsTypes"
                      ],
                      "properties": {
                        "liveMatch": {
                          "$ref": "#/components/schemas/LiveMatch"
                        },
                        "oddsTypes": {
                          "description": "Odds types to return",
                          "type": "array",
                          "items": {
                            "$ref": "#/components/schemas/LiveOddsType"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful operation",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "liveMatch": {
                            "$ref": "#/components/schemas/LiveMatch"
                          },
                          "odds": {
                            "$ref": "#/components/schemas/LiveOddsResults"
                          }
                        }
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "Invalid LiveOddsType provided"
              },
              "404": {
                "description": "LiveMatch not found"
              }
            }
          }
        },
        "/live/listAvailable": {
          "get": {
            "tags": [
              "live"
            ],
            "summary": "List odds available for matches",
            "description": "Returns all available odds types for all live matches with valid odds calculated.",
            "operationId": "listLiveOdds",
            "responses": {
              "200": {
                "description": "successful operation",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "liveMatch": {
                            "$ref": "#/components/schemas/LiveMatch"
                          },
                          "oddsTypes": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/LiveOddsType"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/live/updateLiveMatch/{id}": {
          "put": {
            "tags": [
              "live"
            ],
            "summary": "Update most recent requestId for a live match",
            "description": "TODO",
            "operationId": "updateLiveRequestId",
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "description": "Match id to update",
                "required": true,
                "schema": {
                  "type": "integer"
                }
              }
            ],
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "description": "Latest requestId for the live match",
                    "type": "string"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Successful operation"
              },
              "400": {
                "description": "Invalid requestId supplied"
              },
              "404": {
                "description": "Match id not found"
              }
            }
          }
        }
      },
      "components": {
        "schemas": {
          "LiveMatch": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "description": "Id of live match"
              },
              "requestId": {
                "type": "string",
                "description": "Unique id of most recent update to live match"
              }
            }
          },
          "PrematchOddsType": {
            "description": "Available prematch odds. All returns all available odds.",
            "type": "string",
            "enum": [
              "matchResult",
              "all"
            ]
          },
          "LiveOddsType": {
            "description": "Available prematch odds. All returns all available odds.",
            "type": "string",
            "enum": [
              "matchResult",
              "all"
            ]
          },
          "PrematchOddsResults": {
            "description": "Sum type for prematch odds types response schemas",
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/MatchResultOdds"
                }
              ]
            }
          },
          "LiveOddsResults": {
            "description": "Sum type for live odds types response schemas",
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/MatchResultOdds"
                }
              ]
            }
          },
          "MatchResultOdds": {
            "description": "Predicted odds of each outcome for the end of a match. Matches to matchResult in either PrematchOddsType of LiveOddsType. Arrays are ordered, competitorIds[0] correlates to winOdds[0].",
            "type": "object",
            "properties": {
              "competitorIds": {
                "type": "array",
                "items": {
                  "type": "integer"
                }
              },
              "winOdds": {
                "type": "array",
                "items": {
                  "type": "number"
                }
              }
            }
          }
        }
      }
    },
  });
  return spec;
};