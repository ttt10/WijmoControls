import * as ng2 from 'angular2/core';
import { wjNg2Meta } from './wijmo.angular2.MetaFactory';
import * as wjmeta from './wijmo.angular2.MetaFactory';
type ComplexPropDesc = wjmeta.wj.angular2.ComplexPropDesc;

export module wj {
    export module angular2 {
        'use strict';

        export var WjComponent = function (options: /*IWijmoComponentOptions*/
            {
                // Wijmo specific
                // true indicates that WjComponent represents @Directive; otherwise, @Component.
                // TBD: should be reworked to WjComponent and WjDirective.
                wjIsDirective?: boolean,
                // Directive metadata ID. If not specified then directive's base class (which is normally a control
                // class that it represents) is used as a metadata id.
                wjMetadataId?: any,
                // an array of all possible parent directive types or forwardRef to types.
                wjParentDirectives?: any[],
                // allow to specify the same directive id to multiple "child" directive types to make it possible
                // for them to be correctly ordered in heterogeneous child directive lists (e.g. WjMenuItem and 
                // WjMenuSeparator)
                wjSiblingDirectiveId?: string,
                // A callback static function which is called before any other initialization. A good
                // place to make modifications in metadata.
                //wjInit?: () => void,
                 
                // Angular
                selector?: string,
                inputs?: string[],
                outputs?: string[],
                properties?: string[],
                events?: string[],
                host?: { [key: string]: string },
                /* @deprecated */
                bindings?: any[],
                providers?: any[],
                exportAs?: string,
                moduleId?: string,
                queries?: { [key: string]: any },
                /* @deprecated */
                viewBindings?: any[],
                viewProviders?: any[],
                changeDetection?: ng2.ChangeDetectionStrategy,
                templateUrl?: string,
                template?: string,
                styleUrls?: string[],
                styles?: string[],
                directives?: Array<ng2.Type | any[]>,
                pipes?: Array<ng2.Type | any[]>,
                encapsulation?: ng2.ViewEncapsulation
            }
        ): any {
            return function (target, targetKey): any {
                //if (options.wjInit) {
                //    options.wjInit();
                //}
                var metaId = options.wjMetadataId;
                if (metaId) {
                    delete options.wjMetadataId;
                }
                else {
                    // Use base class reference
                    metaId = Object.getPrototypeOf(target.prototype).constructor;
                }
                var metaData = wjNg2Meta.MetaFactory.getMetaData(metaId);
                options.inputs = (options.inputs || [WjDirectiveBehavior.parPropAttr]).concat(metaData.props.map((propDesc) => propDesc.propertyName));
                var changeEventsMap = Ng2Utils.getChangeEventMap(metaData);
                options.outputs = (options.outputs || []).concat(Ng2Utils.initEvents(target, changeEventsMap));
                target[Ng2Utils.directiveTypeDataProp] = new DirectiveTypeData(metaData, changeEventsMap,
                    options.wjParentDirectives, options.wjSiblingDirectiveId);

                var retNg = options.wjIsDirective ? <any>ng2.Directive(options) : <any>ng2.Component(options);
                var ret = retNg(target, targetKey);

                new MethodProxy(target, 'ngOnInit', WjDirectiveBehavior.prototype.dirOnInit);
                new MethodProxy(target, 'ngOnDestroy', WjDirectiveBehavior.prototype.dirOnDestroy);
                new MethodProxy(target, 'ngOnChanges', WjDirectiveBehavior.prototype.dirOnChanges);

                return ret;
            }
        }

        // Maps event names to corresponding two-way property names whose change the event notifies.
        export type ChangePropertyEvents = { prop: string, evExposed: string, evImpl: string };
        export type EventPropertiesItem =
            {
                event: string,
                eventImpl: string,
                props?: ChangePropertyEvents[]
            };
        export type EventProperties = EventPropertiesItem[];

        export class DirectiveTypeData {
            private _fwdResolved = false;
            private static _siblingIdCounter = 0;

            metaData: wijmo.interop.MetaDataBase;
            changeEventMap: EventProperties;
            // represents WijmoComponent.wjParentDirectives
            parentDirectives: any[];
            siblingId: string;

            constructor(metaData: wijmo.interop.MetaDataBase, changeEventMap: EventProperties, parentDirectives: any[],
                siblingId: string) {
                this.metaData = metaData;
                this.changeEventMap = changeEventMap;
                if (parentDirectives) {
                    this.parentDirectives = [].concat(parentDirectives);
                }
                this.siblingId = siblingId || (++DirectiveTypeData._siblingIdCounter).toString();
            }

            // called by behavior
            public resolveForwardDeclarations() {
                if (!this._fwdResolved) {
                    this._fwdResolved = true;
                    WjDirectiveBehavior.resolveForwardDecl(this.parentDirectives);
                }
            }

        }

        export class WjDirectiveBehavior {
            // Name of the property created on directive instance that references this behavior
            static BehaviourRefProp = 'wjBehaviour';
            static parPropAttr = 'wjProperty';
            static siblingDirIdAttr = 'wj-directive-id';

            private static _pathBinding = new wijmo.Binding('');
            private _parentPropDesc: ComplexPropDesc;
            private _siblingInsertedEH;

            directive: Object;
            typeData: DirectiveTypeData;
            elementRef: ng2.ElementRef;
            injector: ng2.Injector;
            parentBehavior: WjDirectiveBehavior;
            isDestroyed = false;

            static getHostElement(directive: Object, ngHostElRef: ng2.ElementRef): HTMLElement {
                return <HTMLElement>ngHostElRef.nativeElement;
            }

            static attach(directive: Object, elementRef: ng2.ElementRef, injector: ng2.Injector): WjDirectiveBehavior {
                return new WjDirectiveBehavior(directive, elementRef, injector);
            }

            constructor(directive: Object, elementRef: ng2.ElementRef, injector: ng2.Injector) {
                this.directive = directive;
                this.elementRef = elementRef;
                this.injector = injector;
                var typeData: DirectiveTypeData = this.typeData = directive.constructor[Ng2Utils.directiveTypeDataProp];
                directive[WjDirectiveBehavior.BehaviourRefProp] = this;

                // have to do it during directive instance creation because it's too early during directive type initialization 
                typeData.resolveForwardDeclarations();
                this.createEvents();
                MethodProxy.attachInstance(directive, this);
                this._setupAsChild();
                if (this._isHostElement()) {
                    (<HTMLElement>elementRef.nativeElement).setAttribute(WjDirectiveBehavior.siblingDirIdAttr,
                        typeData.siblingId);
                }
            }

            // ----- Directive lifecycle hook proxies
            dirOnInit(originalMethod: Function) {
                originalMethod();
                this._initParent(); 
                this.subscribeToEvents();
                if (this.directive['wjAfterParentInit']) {
                    this.directive['wjAfterParentInit']();
                }
            }

            dirOnDestroy(originalMethod: Function) {
                originalMethod();

                if (this.isDestroyed) {
                    return;
                }
                this.isDestroyed = true;
                var control = this.directive;
                if (this._siblingInsertedEH) {
                    this.elementRef.nativeElement.removeEventListener('DOMNodeInserted', this._siblingInsertedEH);
                }
                if (this._isParentArray() && !this.parentBehavior.isDestroyed) {
                    var parControl = this.parentBehavior.directive,
                        parProp = this._getParentProp();

                    if (parControl && parProp && control) {
                        var parArr: any[] = parControl[parProp];
                        if (parArr) {
                            var idx = parArr.indexOf(control);
                            if (idx >= 0) {
                                parArr.splice(idx, 1);
                            }
                        }
                    }
                }
                if (control instanceof wijmo.Control) {
                    // We call dispose() with a delay, to get directives such as ng-if/ng-repeat a chance to remove its child subtree
                    // berore the control will be disposed. Otherwise, Control.dispose() replaces its host element with an assignment 
                    // to outerHTML, that creates an element clone in its parent with a different pointer, not the one that
                    // ng-if stores locally, so this clone is out of ng-if control and stays in DOM forever.
                    // TBD: do we need this delay in Ng2?
                    // Answer: no, it breaks controls in templates, because Ng2 reuses control's host elements.
                    //setTimeout(function () {
                    if (control.hostElement) {
                        // control.dispose() kills current host element (by outerHTML=... assignment), while Ng2 reuses it,
                        // so we need to keep it in its correct position after call to control.dispose().
                        let host = <HTMLElement>this.elementRef.nativeElement,
                            hostParent = host && host.parentNode,
                            hostIdx = hostParent ? Array.prototype.indexOf.call(hostParent.childNodes, host) : -1;
                        //TBD: !!! control.dispose() will dispose all child controls, we need to dispose all directives before it!!!
                        control.dispose();
                        if (hostIdx > -1 && Array.prototype.indexOf.call(hostParent.childNodes, host) < 0) {
                            host.textContent = '';
                            hostParent.replaceChild(host, hostParent.childNodes[hostIdx]);
                        }
                    }

                    //}, 0);
                }
            }

            dirOnChanges(originalMethod: Function, changes: any) {
                originalMethod(changes);
            }
            // ----- end of Directive lifecycle hook proxies

            public static instantiateTemplate(parent: HTMLElement, viewContainerRef: ng2.ViewContainerRef,
                templateRef: ng2.TemplateRef, domRenderer: ng2.Renderer): { viewRef: ng2.EmbeddedViewRef, rootElement: Element } {
                //var contEl = <Element>viewContainerRef.element.nativeElement,
                //    contParEl = contEl.parentElement;
                var viewRef = viewContainerRef.createEmbeddedView(templateRef, viewContainerRef.length);

                //var nodes = <any[]>domRenderer['getRootNodes'](viewRef['renderFragment']);
                var nodes = viewRef.rootNodes;
                var rootEl = document.createElement('div');
                for (let curNode of nodes) {
                    rootEl.appendChild(curNode);
                }
                if (parent) {
                    parent.appendChild(rootEl);
                }

                return { viewRef: viewRef, rootElement: rootEl };
            }

            private createEvents() {
                var changeEvents = this.typeData.changeEventMap,
                    directive = this.directive;

                //TBD: investigate a way to honor only events/props that are really bound

                // Add event properties.
                for (let curEventMap of changeEvents) {
                    let changeProps = curEventMap.props;
                    if (curEventMap.eventImpl) {
                        directive[curEventMap.eventImpl] = new ng2.EventEmitter(false);
                    }
                    if (changeProps && changeProps.length) {
                        for (let curChangeProp of changeProps) {
                            directive[curChangeProp.evImpl] = new ng2.EventEmitter(false);
                        }
                    }
                }
            }

            private subscribeToEvents() {
                var changeEvents = this.typeData.changeEventMap;
                // Add handlers
                for (let curEventMap of changeEvents) {
                    this.addHandlers(curEventMap);
                }
            }

            private addHandlers(eventMap: EventPropertiesItem) {
                var directive = this.directive;

                (<wijmo.Event>WjDirectiveBehavior.evaluatePath(directive, eventMap.event)).addHandler((s, e) => {
                    if (eventMap.props && eventMap.props.length) {
                        // Trigger property change events
                        for (let curChangeProp of eventMap.props) {
                            (<ng2.EventEmitter<any>>directive[curChangeProp.evImpl]).next(directive[curChangeProp.prop]);
                        }
                    }
                    // Trigger Wijmo event
                    if (eventMap.eventImpl) {
                        (<ng2.EventEmitter<any>>directive[eventMap.eventImpl]).next(e);
                    }
                });
            }

            private _setupAsChild() {
                var parDirs: any[];
                if (!(this._isChild() && (parDirs = this.typeData.parentDirectives) && parDirs.length > 0)) {
                    return;
                }

                if (this._isHostElement()) {
                    (<HTMLElement>this.elementRef.nativeElement).style.display = 'none';
                }

                var nearestDir;
                for (let parType of parDirs) {
                    if (parType) {
                        let curParDir = this.injector.getOptional(parType);
                        if (curParDir) {
                            if (nearestDir) {
                                if (WjDirectiveBehavior.containsDirective(nearestDir, curParDir)) {
                                    nearestDir = curParDir;
                                }
                            } else {
                                nearestDir = curParDir;
                            }
                        }
                    }
                }

                if (!nearestDir) {
                    return;
                }

                let parBehavior = this.parentBehavior = WjDirectiveBehavior.getBehavior(nearestDir),
                    metaData = this.typeData.metaData;
                this._parentPropDesc = new wjNg2Meta.ComplexPropDesc(metaData.parentProperty,
                    metaData.isParentPropertyArray, metaData.ownsObject);
            }

            // --------------------- Child directive ------------------------

            //Determines whether this is a child link.
            //NOTE: functionality is *not* based on _parentPropDesc
            private _isChild(): boolean {
                return this._isParentInitializer() || this._isParentReferencer();
            }
            // Indicates whether this directictive operates as a child directictive that initializes a property of its parent.
            private _isParentInitializer(): boolean {
                return this.typeData.metaData.parentProperty != undefined;
            }

            // Indicates whether this directictive operates as a child directictive that references a parent in its property or
            // a constructor.
            private _isParentReferencer(): boolean {
                return this.typeData.metaData.parentReferenceProperty != undefined;
            }

            //For the child directives returns parent's property name that it services. Property name defined via
            //the wjProperty attribute of directive tag has priority over the directive._property definition.
            //NOTE: functionality is *not* based on _parentPropDesc
            private _getParentProp(): string {
                return this._isParentInitializer() ?
                    this.directive[WjDirectiveBehavior.parPropAttr] || this.typeData.metaData.parentProperty
                    : undefined;
            }

            // For a child directive, the name of the property of the directive's underlying object that receives the reference
            // to the parent, or an empty string that indicates that the reference to the parent should be passed as the 
            // underlying object's constructor parameter.
            private _getParentReferenceProperty(): string {
                return this.typeData.metaData.parentReferenceProperty;
            }

            // Determines whether the child link uses an object created by the parent property, instead of creating it by
            // itself, and thus object's initialization should be delayed until parent link's control is created.
            //IMPORTANT: functionality is *based* on _parentPropDesc
            private _useParentObj(): boolean {
                // we can't support this, all affected properties should be read-write
                return false;
            }

            // For the child link, determines whether the servicing parent property is an array.
            //IMPORTANT: functionality is *based* on _parentPropDesc
            private _isParentArray() {
                return this._isParentInitializer() && this._parentPropDesc.isArray;
            }

            // For the child referencer directive, indicates whether the parent should be passed as a parameter the object
            // constructor.
            private _parentInCtor(): boolean {
                return this._isParentReferencer() && this._getParentReferenceProperty() == '';
            }

            private _initParent() {
                if (!this.parentBehavior || this._useParentObj()) {
                    return;
                }

                var parDir = this.parentBehavior.directive,
                    propName = this._getParentProp(),
                    control = this.directive;
                if (this._isParentInitializer()) {
                    let parProp = this._getParentProp(),
                        parPropDescOverride = wjNg2Meta.MetaFactory.findComplexProp(parProp,
                            this.parentBehavior.typeData.metaData.complexProps);
                    if (parPropDescOverride) {
                        this._parentPropDesc = parPropDescOverride;
                    } else {
                        this._parentPropDesc.propertyName = parProp; 
                    }

                    if (this._isParentArray()) {
                        // insert child at correct index, which is the same as an index of the directive element amid sibling directives
                        // of the same type
                        var parArr = <any[]>parDir[propName],
                            isHostElement = this._isHostElement(),
                            linkIdx = isHostElement ? this._getSiblingIndex() : -1;
                        if (linkIdx < 0 || linkIdx >= parArr.length) {
                            linkIdx = parArr.length;
                        }
                        parArr.splice(linkIdx, 0, control);
                        if (isHostElement) {
                            this._siblingInsertedEH = this._siblingInserted.bind(this);
                            this.elementRef.nativeElement.addEventListener('DOMNodeInserted', this._siblingInsertedEH);
                        }
                    } else {
                        parDir[propName] = control;
                    }
                }
                if (this._isParentReferencer() && !this._parentInCtor()) {
                    control[this._getParentReferenceProperty()] = parDir;
                }
            }

            // Gets an index of this directive host element among another host elements pertain to the same directive type.
            _getSiblingIndex() {
                var thisEl = this.elementRef.nativeElement,
                    parEl = thisEl.parentElement;
                // If parentElement is null, e.g. because this element is temporary in DocumentFragment, the index
                // of the element isn't relevant to the item's position in the array, so we return -1 and thus force
                // a calling code to not reposition the item in the array at all.  
                if (!parEl) {
                    return -1;
                }
                var siblings = parEl.childNodes,
                    idx = -1,
                    dirId = this.typeData.siblingId;
                for (var i = 0; i < siblings.length; i++) {
                    var curEl = <HTMLElement>siblings[i];
                    if (curEl.nodeType == 1 && curEl.getAttribute(WjDirectiveBehavior.siblingDirIdAttr) == dirId) {
                        ++idx;
                        if (curEl === thisEl) {
                            return idx;
                        }
                    }
                }

                return -1;
            }

            private _siblingInserted(e) {
                if (e.target === this.elementRef.nativeElement) {
                    var lIdx = this._getSiblingIndex(),
                        parArr = <any[]>this.parentBehavior.directive[this._getParentProp()],
                        directive = this.directive,
                        arrIdx = parArr.indexOf(directive);
                    if (lIdx >= 0 && arrIdx >= 0 && lIdx !== arrIdx) {
                        parArr.splice(arrIdx, 1);
                        lIdx = Math.min(lIdx, parArr.length);
                        parArr.splice(lIdx, 0, directive);
                    }
                }
            }

            // Indicates whether the host node is HTMLElement. E.g. for template directive a host node is comment.
            private _isHostElement() {
                return (<Node>this.elementRef.nativeElement).nodeType === Node.ELEMENT_NODE 
            }

            // --- end of Child directive ------------------------


            // ----- Utility methods

            private static evaluatePath(obj: any, path: string): any {
                this._pathBinding.path = path;
                return this._pathBinding.getValue(obj);
            }

            static getBehavior(directive: any): WjDirectiveBehavior {
                return directive ? directive[WjDirectiveBehavior.BehaviourRefProp] : null;
            }

            public static containsDirective(parentDirective: Object, childDirective: Object): boolean {
                if (!(parentDirective && childDirective)) {
                    return false;
                }
                var parInj = WjDirectiveBehavior.getBehavior(parentDirective).injector,
                    childInj = WjDirectiveBehavior.getBehavior(childDirective).injector;
                for (let curInj = childInj.parent; curInj; curInj = curInj.parent) {
                    if (parInj === curInj) {
                        return true;
                    }
                }
                return false;
            }

            // updates the array with resolved forwardRef(s), non-forward refs stay untouched
            static resolveForwardDecl(array: any[]) {
                if (!array) {
                    return;
                }

                for (let i = 0; i < array.length; i++) {
                    let curDecl = array[i];
                    array[i] = array[i] ? ng2.resolveForwardRef(array[i]) : array[i];
                }
            }
        }


        export class Ng2Utils {
            //static initInstanceEventsMethod = 'wjInitDirectiveEvents';
            //TBD: use Symbol?
            static directiveTypeDataProp = 'wjDirTypeData';

            // Returns an array for the @Component 'outputs' property.
            public static initEvents(directiveType: any, changeEvents: EventProperties): string[] {
                var ret: string[] = [];
                for (let curEventMap of changeEvents) {
                    let changeProps = curEventMap.props;
                    if (curEventMap.event && curEventMap.eventImpl) {
                        ret.push(curEventMap.eventImpl + ':' + curEventMap.event);
                    }
                    if (changeProps && changeProps.length) {
                        for (let curChangeProp of changeProps) {
                            ret.push(curChangeProp.evImpl + ':' + curChangeProp.evExposed);
                        }
                    }
                }

                return ret;
            }

            private static getChangeEventNameImplemented(propertyName) {
                return Ng2Utils.getChangeEventNameExposed(propertyName) + 'Ng';
            }
            private static getChangeEventNameExposed(propertyName) {
                return propertyName + 'Change';
            }
            private static getWjEventNameImplemented(eventName) {
                return eventName + 'Wj';
            }

            public static getChangeEventMap(metaData: wijmo.interop.MetaDataBase) {
                var ret: EventProperties = [],
                    eventDescArr = metaData.events || [],
                    propDescArr = metaData.props || [];
                ret = eventDescArr.map((ed) => {
                    return {
                        event: ed.eventName,
                        eventImpl: Ng2Utils.getWjEventNameImplemented(ed.eventName),
                        props: ((arr) => arr && arr.length ? arr : null)
                            (
                            metaData.props.filter((pd) => pd.changeEvent === ed.eventName)
                                .map((pd) => {
                                    var ret = 
                                        //return
                                        {
                                            prop: pd.propertyName,
                                            evExposed: Ng2Utils.getChangeEventNameExposed(pd.propertyName),
                                            evImpl: Ng2Utils.getChangeEventNameImplemented(pd.propertyName)
                                        };
                                    return ret;
                                })
                            )
                    }
                })
                // Parent control events
                    .concat(
                    propDescArr.filter((pd) =>
                        pd.changeEvent && pd.changeEvent.indexOf('.') > -1).map((pd) => {
                            var evParts = pd.changeEvent.split('.'),
                                parentEvName = evParts[evParts.length - 1];
                            var ret =
                                {
                                    event: pd.changeEvent,
                                    eventImpl: null, //Ng2Utils.getWjEventNameImplemented(parentEvName),
                                    props: [{
                                        prop: pd.propertyName,
                                        evExposed: Ng2Utils.getChangeEventNameExposed(pd.propertyName),
                                        evImpl: Ng2Utils.getChangeEventNameImplemented(pd.propertyName)
                                    }]
                                }
                            return ret;
                        })
                    );
                return ret;
            }
        }


        class MethodProxy {
            static ProxyRefProp = 'wjProxyHostRef';

            originalMethod: Function;

            constructor(targetType: any, methodName: any, public proxyMethod: Function) {
                var targetProto = targetType.prototype;
                // take original method, if exists
                this.originalMethod = targetProto[methodName];
                targetProto[methodName] = this._getMethodStub();
            }

            static attachInstance(target: Object, proxy: Object) {
                target[MethodProxy.ProxyRefProp] = proxy;
            }

            // implementation looks from the target
            _getMethodStub(): (...params: any[]) => void {
                // closure variables
                var methodProxy = this;

                // this function will be called by target
                var ret = function (...params: any[]) {
                    var targetThis = <any>this,
                        proxy = targetThis[MethodProxy.ProxyRefProp];

                    var originalCall = function (...params: any[]) {
                        if (methodProxy.originalMethod) {
                            methodProxy.originalMethod.apply(targetThis, params);
                        }
                    }
                    var parArr = [originalCall];
                    if (params != null && params.length) {
                        parArr = parArr.concat(params);
                    }
                    methodProxy.proxyMethod.apply(proxy, parArr);
                }

                return ret;
            }

        }
    }
}

export var wjNg2Base = wj.angular2;
export var WjComponent = wjNg2Base.WjComponent;
export var WjDirectiveBehavior = wjNg2Base.WjDirectiveBehavior;

