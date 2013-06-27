/**
 * Класс-отображение регионов на карте.
 * @class
 * @name RegionSelector.MapView
 * @param {ymaps.Map} map Карта.
 */
RegionSelector.MapView = function (map) {
    this._map = map;
    this._regions = null;
    this._activeItem = null;
    this.events = new ymaps.event.Manager();
};

/**
 * @lends RegionSelector.MapView.prototype
 */
RegionSelector.MapView.prototype = {
    /**
     * @constuctor
     */
    constructor: RegionSelector.MapView,
    /**
     * Добавление обработчиков событий.
     * @function
     * @private
     * @name RegionSelector.MapView._attachHandlers
     */
    _attachHandlers: function () {
        this._regions.events.add('click', this._onClick, this);
        this._regions.events.add('mouseenter', this._onMouseEnter, this);
        this._regions.events.add('mouseleave', this._onMouseLeave, this);
    },
    /**
     * Удаление обработчиков событий.
     * @function
     * @private
     * @name RegionSelector.MapView._detachHandlers
     */
    _detachHandlers: function () {
        this._regions.events.remove('click', this._onClick, this);
        this._regions.events.remove('mouseleave', this._onMouseLeave, this);
        this._regions.events.remove('mouseenter', this._onMouseEnter, this);
    },
    /**
     * Обработчик клика на области региона.
     * @function
     * @private
     * @name RegionSelector.MapView._onClick
     * @param {ymaps.data.Manager} e Менеджер данных.
     */
    _onClick: function (e) {
        var region = e.get('target'),
            index = this._regions.indexOf(region);

        this
            .unsetActiveItem()
            .setActiveItem(index);

        this.events.fire('itemselected', {
            index: index
        });
    },
    /**
     * Обработчик наведения мыши на область региона.
     * @function
     * @private
     * @name RegionSelector.MapView._onMouseEnter
     * @param {ymaps.data.Manager} e Менеджер данных.
     */
    _onMouseEnter: function (e) {
    /*
        var region = e.get('target'),
            index = this._regions.indexOf(region);

        region.options.set('preset', this.constructor.SELECTED_PRESET);
        this.events.fire('itemselected', {
            index: index
        });
    */
    },
    /**
     * Обработчик сведения мыши с области региона.
     * @function
     * @private
     * @name RegionSelector.MapView._onMouseLeave
     * @param {ymaps.data.Manager} e Менеджер данных.
     */
    _onMouseLeave: function (e) {
    /*
        e.get('target')
            .options.set('preset', '');
    */
    },
    /**
     * Отображение данных на карте.
     * @function
     * @name RegionSelector.MapView.render
     * @param {ymaps.data.Manager} data Менеджер данных.
     * @returns {RegionSelector.MapView} Возвращает ссылку на себя.
     */
    render: function (data) {
        this._map.geoObjects.add(
            this._regions = data.get('regions')
        );
        this.setFocusOnRegions();
        this._map.setBounds(this._regions.getBounds());
        this._regions.options.set({
            zIndex: 1,
            zIndexHover: 1
        });
        this._attachHandlers();

        return this;
    },
    /**
     * Удаление данных с карты.
     * @function
     * @name RegionSelector.MapView.clear
     * @returns {RegionSelector.MapView} Возвращает ссылку на себя.
     */
    clear: function () {
        if(this._regions) {
            this._detachHandlers();
            this._map.geoObjects.remove(this._regions);
            this._regions = null;
            this._activeItem = null;
        }

        return this;
    },
    /**
     * Выделяем активный регион.
     * @function
     * @name RegionSelector.MapView.setActiveItem
     * @param {Number} index Индекс региона в коллекции.
     * @returns {RegionSelector.MapView} Возвращает ссылку на себя.
     */
    setActiveItem: function (index) {
        var region = this._activeItem = this._regions.get(index);

        region.options.set('preset', this.constructor.SELECTED_PRESET);

        return this;
    },
    /**
     * Снимаем выделение активного региона.
     * @function
     * @name RegionSelector.MapView.unsetActiveItem
     * @returns {RegionSelector.MapView} Возвращает ссылку на себя.
     */
    unsetActiveItem: function () {
        if(this._activeItem) {
            this._activeItem.options.set('preset', '');
            this._activeItem = null;
        }

        return this;
    },
    /**
     * Выставляем карте область видимости на определенный регион.
     * @function
     * @name RegionSelector.MapView.setFocusOnRegion
     * @param {Number} index Порядковый номер региона в геоколлекции.
     * @returns {RegionSelector.MapView} Возвращает ссылку на себя.
     */
    setFocusOnRegion: function (index) {
        this._map.setBounds(
            this._regions.get(index).geometry.getBounds(), {
                checkZoomRange: true
                //, duration: 1000
            }
        );

        return this;
    },
    /**
     * Выставляем карте область видимости по всем регионам.
     * @function
     * @name RegionSelector.MapView.setFocusOnRegions
     * @returns {RegionSelector.MapView} Возвращает ссылку на себя.
     */
    setFocusOnRegions: function () {
        this._map.setBounds(this._regions.getBounds());

        return this;
    }
};

/**
 * Стили отображения выделенного региона.
 * @static
 * @constant
 */
RegionSelector.MapView.SELECTED_PRESET = {
    strokeWidth: 1,
    fillColor: 'F99',
    strokeColor: 'F99'
};