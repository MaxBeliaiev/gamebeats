import { createSwaggerSpec } from 'next-swagger-doc';
import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react'

export default function OddsApiDoc() {
  const spec = createSwaggerSpec({
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
  return <SwaggerUI spec={spec} />;
}
