import { View } from './view';
import { Game } from './game';
import { EventsManager } from './eventsManager';
import { Storage } from './storage';

export class Controller {
  #view;
  #model;
  #storage;
  #eventsManager;
  #gameDataStorageKey = 'musicAppKey';

  constructor(root) {
    this.#eventsManager = new EventsManager();

    this.#eventsManager.subscribe('gameStart', (data) => {
      this.#view.renderQuestionPage();
      this.#model.getNewQuestion(data);
    });

    this.#eventsManager.subscribe('newQuestion', (data) => {
      this.#view.updateQuestionPage(data);
    });

    this.#eventsManager.subscribe('getHint', () =>
      this.#model.updateNumberOfHintsAvailable()
    );

    this.#eventsManager.subscribe('noHintAvailable', () =>
      this.#view.disableGetHintButton()
    );

    this.#eventsManager.subscribe('newAnswer', (data) => {
      this.#model.saveUserAnswer(data);
      this.#model.getNewQuestion();
    });

    this.#eventsManager.subscribe('gameEnd', (data) => {
      this.#view.renderResults(data);
    });

    this.#eventsManager.subscribe('storeGameData', (data) => {
      this.#storage.setItem(this.#gameDataStorageKey, data);
    });

    this.#eventsManager.subscribe('getGameData', () =>
      this.#storage.getItem(this.#gameDataStorageKey)
    );

    this.#eventsManager.subscribe('gameDataLoaded', (data) =>
      this.#model.loadScores(data)
    );

    this.#storage = new Storage((data) =>
      this.#eventsManager.publish('gameDataLoaded', data)
    );

    this.#view = new View(
      root,
      (data) => this.#eventsManager.publish('gameStart', data),
      () => this.#eventsManager.publish('getHint'),
      (data) => this.#eventsManager.publish('newAnswer', data),
      () => this.init()
    );
  }

  init() {
    this.#model = new Game(
      (data) => this.#eventsManager.publish('newQuestion', data),
      () => this.#eventsManager.publish('noHintAvailable'),
      (data) => this.#eventsManager.publish('gameEnd', data),
      (data) => this.#eventsManager.publish('storeGameData', data),
      () => this.#eventsManager.publish('getGameData')
    );
    this.#view.renderStartPage();
  }
}
