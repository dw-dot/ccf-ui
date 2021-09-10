/* eslint-disable @typescript-eslint/member-ordering */
import { Immutable } from '@angular-ru/common/typings';
import { Injectable } from '@angular/core';
import { bind } from 'bind-decorator';
import { OntologyTreeNode } from 'ccf-database';
import { at } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OntologyState } from '../../store/ontology/ontology.state';


/**
 * Search result interface type for the search results
 */
export interface SearchResult {
  /** ensures order of search-results */
  index: number;

  /** label to be displayed in the view */
  displayLabel: string[];

  /**  instance of OntologyTreeNode, provides data associated with a search result */
  node: OntologyTreeNode;
}

/**
 * Injectable OntologySearchService responsible for search result computations
 */
@Injectable({
  providedIn: 'root'
})
export class OntologySearchService {
  /** Root node in ontology. */
  get rootNode(): Observable<Immutable<OntologyTreeNode>> {
    return this.ontologyState.rootNode$;
  }

  /**
   * Creates an instance of ontology search service.
   *
   * @param ontologyState The global ontology state.
   */
  constructor(private readonly ontologyState: OntologyState) { }

  /**
   * Searches the ontology with the search-term
   *
   * @param value the search term
   * @returns an array of search-results
   */
  filter(value: string): Observable<SearchResult[]> {
    return this.ontologyState.nodes$.pipe(
      map(nodes => this.lookup(nodes, value.toLowerCase()))
    );
  }

  /**
   * looks up ontology nodes and composes search results
   *
   * @param nodes Ontology nodes
   * @param searchValue search text in lower case
   * @returns search results
   */
  private lookup(nodes: Immutable<OntologyTreeNode>[], searchValue: string): SearchResult[] {
    const searchResults = new Map<string, SearchResult>();

    if (nodes) {
      nodes.forEach((node: OntologyTreeNode) => {
        const condition = node.label.toLowerCase().includes(searchValue);

        if (condition && !searchResults.get(node.id)) {
          searchResults.set(node.id, {
            index: this.getIndexOfMatch(node.label, searchValue),
            displayLabel: this.formatLabel(node.label, searchValue),
            node
          });
        } else {
          const match = node.synonymLabels.find((label) => label.toLowerCase().includes(searchValue));

          if (match && !searchResults.get(node.id)) {
            searchResults.set(node.id, {
              index: this.getIndexOfMatch(node.label + ' (' + match + ')', searchValue),
              displayLabel: this.formatLabel(node.label + ' (' + match + ')', searchValue),
              node
            });
          }
        }
      });
    }

    return Array.from(searchResults.values());
  }

  /**
   * Gets index of match in the ontology label
   *
   * @param label the provided ontology node label or synonym label
   * @param searchValue the searched text in lower case
   * @returns the index of the match in the label
   */
  getIndexOfMatch(label: string, searchValue: string): number {
    return label.toLowerCase().indexOf(searchValue);
  }

  /**
   * Formats label based on where the search-term was found in the OntologyTreeNode
   *
   * @param label label or first synonym-label of OntologyTreeNode which has the search-term
   * @param searchValue search-term
   * @returns an array in the form of [prefix, search-term, suffix]
   */
  formatLabel(label: string, searchValue: string): string[] {
    const index = this.getIndexOfMatch(label, searchValue);
    return [
      label.substr(0, index),
      label.substr(index, searchValue.length),
      label.substr(index + searchValue.length, label.length)
    ];
  }

  /**
   * Fetches the children of an ontology node.
   * Note: This can be called without a reference to `this`.
   *
   * @param node The node for which to get children.
   * @returns An array of children, empty if the node has no children.
   */
  @bind
  getChildren(node: OntologyTreeNode): OntologyTreeNode[] {
    const nodes = this.ontologyState.snapshot.nodes;
    return at(nodes, node.children) as OntologyTreeNode[];
  }
}