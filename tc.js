"use strict";

let gameResultEnum = Object.freeze({
  HUMAN_WIN: "You win!",
  COMPUTER_WIN: "Computer win!",
  DRAW: "It's a draw!",
  STILL_PLAYING: "STILL_PLAYING"
});

function Event(sender) {
  this._sender = sender;
  this._listeners = [];
}

Event.prototype = {
  attach: function(listener) {
    this._listeners.push(listener);
  },
  notify: function(args) {
    for (let index = 0; index < this._listeners.length; index += 1) {
      this._listeners[index](this._sender, args);
    }
  }
};

function TicTacToeModel() {
  //private begin
  const _this = this;
  let _humanSign, _computerSign;
  const _maxMoves = 9;
  let _moves = new Array(_maxMoves).fill(undefined);
  let _results = {
    human: 0,
    draw: 0,
    computer: 0
  };
  //private end

  _this.incrementHumanResult = function() {
    _results.human++;
  };

  _this.incrementDrawResult = function() {
    _results.draw++;
  };
  _this.incrementComputerResult = function() {
    _results.computer++;
  };

  _this.getMaxMoves = function() {
    return _maxMoves;
  };

  _this.getResults = function() {
    return Object.assign({}, _results);
  };

  _this.getMoves = function() {
    return _moves.slice();
  };

  _this.getMove = function(cell) {
    return _moves[cell];
  };

  _this.isCellEmpty = function(index) {
    return _moves[index] === undefined;
  };

  _this.getHumanSign = function() {
    return _humanSign;
  };

  _this.setHumanSign = function(sign) {
    _humanSign = sign;
  };

  _this.getComputerSign = function() {
    return _computerSign;
  };

  _this.setComputerSign = function(sign) {
    _computerSign = sign;
  };

  _this.setMove = function(cellIndex, value) {
    _moves[cellIndex] = value;
    return _this;
  };

  _this.emtyAllTheMoves = function() {
    _moves.fill(undefined);
    return _this;
  };
}

function TicTacToeView(elements) {
  //private begin
  const _this = this;
  let _cellElements = elements.cells;
  let _elements = elements;

  function _setupEvents() {
    _this.events = {
      cells: {},
      playButtonClicked: new Event(_this),
      humanResultAnimationFinished: new Event(_this),
      drawResultAnimationFinished: new Event(_this),
      computerResultAnimationFinished: new Event(_this)
    };
    for (let i = 0; i < _cellElements.length; i++)
      Object.defineProperty(_this.events.cells, i + "Clicked", {
        value: new Event(_this),
        writable: false
      });
  }

  // attach listeners to HTML controls
  function _attachListeners() {
    _elements.results.human.addEventListener("animationend", function(event) {
      _this.events.humanResultAnimationFinished.notify();
    });
    _elements.results.draw.addEventListener("animationend", function(event) {
      _this.events.drawResultAnimationFinished.notify();
    });
    _elements.results.computer.addEventListener("animationend", function(
      event
    ) {
      _this.events.computerResultAnimationFinished.notify();
    });

    _cellElements[0].onclick = function() {
      _this.events.cells["0Clicked"].notify();
    };
    _cellElements[1].onclick = function() {
      _this.events.cells["1Clicked"].notify();
    };
    _cellElements[2].onclick = function() {
      _this.events.cells["2Clicked"].notify();
    };
    _cellElements[3].onclick = function() {
      _this.events.cells["3Clicked"].notify();
    };
    _cellElements[4].onclick = function() {
      _this.events.cells["4Clicked"].notify();
    };
    _cellElements[5].onclick = function() {
      _this.events.cells["5Clicked"].notify();
    };
    _cellElements[6].onclick = function() {
      _this.events.cells["6Clicked"].notify();
    };
    _cellElements[7].onclick = function() {
      _this.events.cells["7Clicked"].notify();
    };
    _cellElements[8].onclick = function() {
      _this.events.cells["8Clicked"].notify();
    };

    _elements.playButton.onclick = function() {
      _this.events.playButtonClicked.notify();
    };
  }

  //private end

  _this.radio = elements.radio;

  _this.removeClassFromHumanResult = function(cssClass) {
    _elements.results.human.classList.remove(cssClass);
  };
  _this.removeClassFromDrawResult = function(cssClass) {
    _elements.results.draw.classList.remove(cssClass);
  };
  _this.removeClassFromComputerResult = function(cssClass) {
    _elements.results.computer.classList.remove(cssClass);
  };

  _this.fadeOutOverlay = function() {
    _this.fadeOut(_elements.div.overlay);
  };

  _this.fadeOut = function(element) {
    element.style.opacity = 1;

    function _fadeOut() {
      (element.style.opacity -= 0.025) < 0
        ? (element.style.display = "none")
        : setTimeout(_fadeOut, 25);
    }
    _fadeOut();
  };

  _this.fadeInOverlay = function() {
    _this.fadeIn(_elements.div.overlay);
  };

  _this.fadeIn = function(element) {
    element.style.display = "";
    element.style.opacity = 0;

    function _fadeIn() {
      if (
        (element.style.opacity = parseFloat(element.style.opacity) + 0.025) < 1
      )
        setTimeout(_fadeIn, 25);
      else element.style.opacity = 1;
    }
    _fadeIn();
  };

  _this.hideStartMenu = function() {
    _this.fadeOutOverlay();
    _this.fadeOut(_elements.div.startMenu);
  };

  _this.showResultMessage = function(msg) {
    _elements.p.gameResultText.textContent = msg;
    _elements.div.showResult.style.removeProperty("display");
    _this.fadeInOverlay();
  };

  _this.addTransparentOverlay = function() {
    _elements.div.overlay.style.removeProperty("display");
    _elements.div.overlay.style.opacity = 0;
  };

  _this.renderMesh = function(viewModel) {
    _cellElements[viewModel.cellIndex].innerText = viewModel.value;
  };

  _this.addClassToCells = function(viewModel) {
    viewModel.cellsIndex.forEach(function(cellIndex) {
      _cellElements[cellIndex].className = viewModel.class;
    });
  };

  _this.removeClassFromCells = function(viewModel) {
    viewModel.cellsIndex.forEach(function(cellIndex) {
      _cellElements[cellIndex].classList.remove(viewModel.class);
    });
  };

  _this.renderResults = function(viewModel) {
    _elements.results.human.textContent = viewModel.human;
    _elements.results.draw.textContent = viewModel.draw;
    _elements.results.computer.textContent = viewModel.computer;
    switch (viewModel.highlight) {
      case gameResultEnum.HUMAN_WIN:
        _elements.results.human.className = "highlightResult";
        break;
      case gameResultEnum.DRAW:
        _elements.results.draw.className = "highlightResult";
        break;
      case gameResultEnum.COMPUTER_WIN:
        _elements.results.computer.className = "highlightResult";
        break;
    }
  };

  _this.cleanTheMesh = function() {
    for (let i = 0; i < _elements.cells.length; i++)
      _elements.cells[i].innerText = "";
  };

  _this.beep = function() {
    var snd = new Audio(
      "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
    );
    snd.play();
  };

  _setupEvents();
  _attachListeners();
}

function TicTacToeController(model, view) {
  //private begin
  const _this = this;
  const _model = model;
  const _view = view;
  const _winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const arraysOfPairedLines = _getArraysOfPairedLines();

  function _getArraysOfPairedLines() {
    let arraysOfPairedLines = [];
    for (let i = 0; i < _model.getMaxMoves(); i++) {
      let tempPairedLines = [];
      for (let winingCombination of _winningCombinations) {
        if (winingCombination.includes(i))
          tempPairedLines.push(winingCombination);
      }
      if (tempPairedLines.length > 1) arraysOfPairedLines.push(tempPairedLines);
    }
    return arraysOfPairedLines;
  }

  function _setEvents() {
    _view.events.playButtonClicked.attach(function() {
      _startGame();
    });
    _view.events.humanResultAnimationFinished.attach(function() {
      _view.removeClassFromHumanResult("highlightResult");
    });
    _view.events.drawResultAnimationFinished.attach(function() {
      _view.removeClassFromDrawResult("highlightResult");
    });
    _view.events.computerResultAnimationFinished.attach(function() {
      _view.removeClassFromComputerResult("highlightResult");
    });
    Object.getOwnPropertyNames(_view.events.cells).forEach(function(
      value,
      index
    ) {
      _view.events.cells[value].attach(function() {
        _humanClickedTheMesh(index);
      });
    });
  }
  _setEvents();

  function _startGame() {
    _view.renderResults({
      human: _model.getResults().human,
      draw: _model.getResults().draw,
      computer: _model.getResults().computer
    });
    _view.hideStartMenu();
    if (_view.radio.xChoice.checked === true) {
      _model.setHumanSign("x");
      _model.setComputerSign("o");
    } else {
      _model.setHumanSign("o");
      _model.setComputerSign("x");
      _computerTakesAction();
    }
  }

  function _showResultMessage(result) {
    _view.showResultMessage(result);
  }

  function _setTheResult(result) {
    let viewModel = {};
    switch (result) {
      case gameResultEnum.HUMAN_WIN:
        _model.incrementHumanResult();
        viewModel.highlight = gameResultEnum.HUMAN_WIN;
        break;
      case gameResultEnum.DRAW:
        _model.incrementDrawResult();
        viewModel.highlight = gameResultEnum.DRAW;
        break;
      case gameResultEnum.COMPUTER_WIN:
        _model.incrementComputerResult();
        viewModel.highlight = gameResultEnum.COMPUTER_WIN;
        break;
    }
    viewModel.human = _model.getResults().human;
    viewModel.draw = _model.getResults().draw;
    viewModel.computer = _model.getResults().computer;

    _view.renderResults(viewModel);
  }

  function _cleanTheMesh() {
    _model.emtyAllTheMoves();
  }

  function _onGameEnd(gameResult) {
    _view.addClassToCells({
      cellsIndex: gameResult.combinationToHighlight,
      class: "highlight"
    });
    _view.addTransparentOverlay();
    setTimeout(function() {
      _showResultMessage(gameResult.result);
      setTimeout(function() {
        _view.fadeOutOverlay();
        setTimeout(function() {
          _cleanTheMesh();
          _view.cleanTheMesh();
          _view.removeClassFromCells({
            cellsIndex: gameResult.combinationToHighlight,
            class: "highlight"
          });
          _setTheResult(gameResult.result);
          if (_model.getComputerSign() === "x") _computerTakesAction();
        }, 1000);
      }, 2000);
    }, 1000);
  }

  function _setHumanAction(index) {
    _model.setMove(index, _model.getHumanSign());
    _view.renderMesh({
      cellIndex: index,
      value: _model.getMove(index)
    });
  }

  function _humanClickedTheMesh(index) {
    if (_model.isCellEmpty(index)) {
      _setHumanAction(index);
      let gameResult = _this.getGameResult();
      if (gameResult.result !== gameResultEnum.STILL_PLAYING)
        _onGameEnd(gameResult);
      else {
        _computerTakesAction();
        let gameResult = _this.getGameResult();
        if (gameResult.result !== gameResultEnum.STILL_PLAYING)
          _onGameEnd(gameResult);
      }
    } else _view.beep();
  }

  /**
           
    1) Win: If you have two in a row, play the third to get three in a row.

    2) Block: If the opponent has two in a row, play the third to block them.

    3) Fork: Create an opportunity where you can win in two ways.

    4) Block Opponent's Fork:

    Option 1: Create two in a row to force the opponent into defending, as long as it doesn't result in them creating a fork or winning. For example, if "X" has a corner, "O" has the center, and "X" has the opposite corner as well, "O" must not play a corner in order to win. (Playing a corner in this scenario creates a fork for "X" to win.)

    Option 2: If there is a configuration where the opponent can fork, block that fork.

    5) Center: Play the center.

    6) Opposite Corner: If the opponent is in the corner, play the opposite corner.

    7) Empty Corner: Play an empty corner.

    8) Empty Side: The player plays in a middle square on any of the 4 sides.
    */
  function _computerTakesAction() {
    const _corners = [0, 2, 6, 8];
    const _edges = [1, 3, 5, 7];
    const _oppositeCorners = {
      0: 8,
      2: 6,
      6: 2,
      8: 0
    };
    const _centerCell = 4;

    function _getCommonCell(firstLine, secondLine) {
      for (let cell of firstLine) if (secondLine.includes(cell)) return cell;
    }

    function _getLinesThatContainCell(cellIndex) {
      for (let lines of arraysOfPairedLines) {
        if (_isCellCommonForAllLines(cellIndex, lines)) return lines;
      }
    }

    function _isCellCommonForAllLines(cellIndex, lines) {
      return lines.every(function(line) {
        return line.includes(cellIndex);
      });
    }

    function _isTheCommonCellFree(firstLine, secondLine) {
      return _model.isCellEmpty(_getCommonCell(firstLine, secondLine));
    }

    function _isJustOneCellOccupiedAndTheOtherAreFree(line, occupiedBy) {
      return (
        line.filter(function(cell) {
          return _model.getMove(cell) === occupiedBy;
        }).length === 1 &&
        line.filter(function(cell) {
          return _model.isCellEmpty(cell);
        }).length === 2
      );
    }

    function _tryToWin() {
      for (let winingCombination of _winningCombinations) {
        let numOfHits = 0;
        let emptyCellIndex;
        for (let cellIndex of winingCombination) {
          if (_model.getMove(cellIndex) === _model.getComputerSign())
            numOfHits++;
          else if (_model.isCellEmpty(cellIndex)) emptyCellIndex = cellIndex;
        }
        if (numOfHits === 2) {
          if (emptyCellIndex !== undefined) {
            return {
              cellIndex: emptyCellIndex,
              value: _model.getComputerSign()
            };
          }
        }
      }
      return false;
    }

    function _tryToBlock() {
      for (let winingCombination of _winningCombinations) {
        let numOfHits = 0;
        let emptyCellIndex;
        for (let cellIndex of winingCombination) {
          if (_model.getMove(cellIndex) === _model.getHumanSign()) numOfHits++;
          else if (_model.isCellEmpty(cellIndex)) emptyCellIndex = cellIndex;
        }
        if (numOfHits === 2) {
          if (emptyCellIndex !== undefined) {
            return {
              cellIndex: emptyCellIndex,
              value: _model.getComputerSign()
            };
          }
        }
      }
      return false;
    }

    function _tryToFork() {
      for (let pairedLines of arraysOfPairedLines) {
        for (let i = 0; i < pairedLines.length; i++) {
          if (
            _isJustOneCellOccupiedAndTheOtherAreFree(
              pairedLines[i],
              _model.getComputerSign()
            )
          ) {
            for (let y = i + 1; y < pairedLines.length; y++) {
              if (
                _isJustOneCellOccupiedAndTheOtherAreFree(
                  pairedLines[y],
                  _model.getComputerSign()
                )
              ) {
                if (_isTheCommonCellFree(pairedLines[i], pairedLines[y])) {
                  return {
                    cellIndex: _getCommonCell(pairedLines[i], pairedLines[y]),
                    value: _model.getComputerSign()
                  };
                }
              }
            }
          }
        }
      }
      return false;
    }

    function _tryToBlockOpponentsFork() {
      function _option1() {
        for (let winingCombination of _winningCombinations) {
          if (
            _isJustOneCellOccupiedAndTheOtherAreFree(
              winingCombination,
              _model.getComputerSign()
            )
          ) {
            let emptyCellsInWiningCombination = winingCombination.filter(
              function(cell) {
                return _model.isCellEmpty(cell);
              }
            );

            for (let i = 0; i < emptyCellsInWiningCombination.length; i++) {
              let arrayOfPairedLinesThatContainThisCell = _getLinesThatContainCell(
                emptyCellsInWiningCombination[i]
              );

              let temp = arrayOfPairedLinesThatContainThisCell.filter(function(
                line
              ) {
                return line.some(function(cell) {
                  return _model.getMove(cell) === _model.getHumanSign();
                });
              });
              //if he can't make fork with this cell
              if (
                arrayOfPairedLinesThatContainThisCell.filter(function(line) {
                  return line.some(function(cell) {
                    return _model.getMove(cell) === _model.getHumanSign();
                  });
                }).length <= 1
              ) {
                if (i === 0)
                  return {
                    cellIndex: emptyCellsInWiningCombination[1],
                    value: _model.getComputerSign()
                  };
                else
                  return {
                    cellIndex: emptyCellsInWiningCombination[0],
                    value: _model.getComputerSign()
                  };
              }
            }
          }
        }
        return false;
      }

      function _option2() {
        for (let pairedLines of arraysOfPairedLines) {
          for (let i = 0; i < pairedLines.length; i++) {
            if (
              _isJustOneCellOccupiedAndTheOtherAreFree(
                pairedLines[i],
                _model.getHumanSign()
              )
            ) {
              for (let y = i + 1; y < pairedLines.length; y++) {
                if (
                  _isJustOneCellOccupiedAndTheOtherAreFree(
                    pairedLines[y],
                    _model.getHumanSign()
                  )
                ) {
                  if (_isTheCommonCellFree(pairedLines[i], pairedLines[y])) {
                    return {
                      cellIndex: _getCommonCell(pairedLines[i], pairedLines[y]),
                      value: _model.getComputerSign()
                    };
                  }
                }
              }
            }
          }
        }
        return false;
      }
      if (
        _model.getMoves().filter(function(value) {
          return value !== undefined;
        }).length < 3
      )
        return false;
      else return _option1() || _option2();
    }

    function _tryToPlayTheCenter() {
      if (_model.isCellEmpty(_centerCell))
        return {
          cellIndex: _centerCell,
          value: _model.getComputerSign()
        };
      return false;
    }

    function _tryToPlayOppositeCorner() {
      let occupiedCornersOfHuman = _corners.filter(function(corner) {
        return _model.getMove(corner) === _model.getHumanSign();
      });
      for (let i = 0; i < occupiedCornersOfHuman.length; i++)
        if (_model.isCellEmpty(_oppositeCorners[occupiedCornersOfHuman[i]]))
          return {
            cellIndex: _oppositeCorners[occupiedCornersOfHuman[i]],
            value: _model.getComputerSign()
          };

      return false;
    }

    function _tryToPlayEmptyCorner() {
      if (
        _corners.some(function(corner) {
          return _model.isCellEmpty(corner);
        })
      ) {
        while (true) {
          let corner = _corners[Math.floor(Math.random() * _corners.length)];
          if (_model.isCellEmpty(corner))
            return {
              cellIndex: corner,
              value: _model.getComputerSign()
            };
        }
      }
      return false;
    }

    function _tryToPlayEmptyEdge() {
      if (
        _edges.some(function(edge) {
          return _model.isCellEmpty(edge);
        })
      ) {
        while (true) {
          let edge = _edges[Math.floor(Math.random() * _edges.length)];
          if (_model.isCellEmpty(edge))
            return {
              cellIndex: edge,
              value: _model.getComputerSign()
            };
        }
      }
      return false;
    }

    let viewModel;
    if (
      (viewModel =
        _tryToWin() ||
        _tryToBlock() ||
        _tryToFork() ||
        _tryToBlockOpponentsFork() ||
        _tryToPlayTheCenter() ||
        _tryToPlayOppositeCorner() ||
        _tryToPlayEmptyCorner() ||
        _tryToPlayEmptyEdge())
    ) {
      _model.setMove(viewModel.cellIndex, viewModel.value);
      _view.renderMesh(viewModel);
    }
  }

  //private end

  _this.getGameResult = function() {
    for (let winingCombination of _winningCombinations) {
      if (
        winingCombination.every(function(cell) {
          return _model.getMove(cell) === _model.getHumanSign();
        })
      )
        return {
          result: gameResultEnum.HUMAN_WIN,
          combinationToHighlight: winingCombination
        };

      if (
        winingCombination.every(function(cell) {
          return _model.getMove(cell) === _model.getComputerSign();
        })
      )
        return {
          result: gameResultEnum.COMPUTER_WIN,
          combinationToHighlight: winingCombination
        };
    }
    if (!_model.getMoves().includes(undefined))
      return {
        result: gameResultEnum.DRAW,
        combinationToHighlight: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      };
    return {
      result: gameResultEnum.STILL_PLAYING
    };
  };
}

$(document).ready(function() {
  let elements = {};
  elements.cells = document.getElementById("mesh").getElementsByTagName("td");
  elements.playButton = document.getElementById("playButton");
  elements.radio = {
    xChoice: document.getElementById("xChoice"),
    oChoice: document.getElementById("oChoice")
  };
  elements.results = {
    human: document.getElementById("humanResult"),
    draw: document.getElementById("drawResult"),
    computer: document.getElementById("computerResult")
  };

  elements.div = {
    overlay: document.getElementsByClassName("overlay")[0],
    startMenu: document.getElementById("jsStartMenu"),
    showResult: document.getElementById("showResult")
  };
  elements.p = {
    gameResultText: document.getElementById("gameResultText")
  };

  var controller = new TicTacToeController(
    new TicTacToeModel(),
    new TicTacToeView(elements)
  );
});
