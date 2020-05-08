import { EventEmitter } from 'events';
import { toRDF } from 'jsonld';
import { JsonLd, Url } from 'jsonld/jsonld-spec';
import { DataFactory } from 'n3';
import * as RDF from 'rdf-js';
import { RdfXmlParser } from 'rdfxml-streaming-parser';
import { Readable } from 'readable-stream';

export * from 'n3';


/**
 * Turns a stream of values into an array.
 *
 * @param readStream The input stream.
 * @returns A promise that resolves to an array of values when the stream completes.
 */
export function streamToArray<T = unknown>(readStream: EventEmitter): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const chunks: T[] = [];
    readStream
      .on('data', (chunk: T) => { chunks.push(chunk); })
      .once('end', () => { resolve(chunks); })
      .once('error', (err) => { reject(err); });
  });
}

/**
 * Turns an array into a readable stream.
 *
 * @param arr The values.
 * @returns A new readable stream emitting the values from the array.
 */
export function arrayToStream<T>(arr: T[]): Readable {
  const length = arr.length;
  let i = 0;

  return new Readable({
    objectMode: true,
    read() {
      this.push(i < length ? arr[i++] : null);
    }
  });
}

/**
 * Adds data from json ld to the store.
 * Accepts either a json object or an uri to load data from.
 *
 * @param uri A data uri or a json object.
 * @param store The store to add data to.
 * @returns A promise that resolves when the data has been added.
 */
export async function addJsonLdToStore(
  uri: JsonLd | Url, store: RDF.Sink<EventEmitter, EventEmitter>
): Promise<RDF.Sink<EventEmitter, EventEmitter>> {
  let jsonLdData: JsonLd;
  if (typeof uri === 'string') {
    const response = await fetch(uri, { redirect: 'follow' });
    jsonLdData = (await response.json()) as JsonLd;
  } else {
    jsonLdData = uri;
  }

  const quads = (await toRDF(jsonLdData)) as unknown[];
  store.import(arrayToStream(quads));
  return store;
}

/**
 * Adds data from rdf xml to the store.
 *
 * @param uri Data uri to load xml from.
 * @param store The store to add data to
 * @returns A promise that resolves when the data has been added.
 */
export async function addRdfXmlToStore(
  uri: string, store: RDF.Sink<EventEmitter, EventEmitter>
): Promise<RDF.Sink<EventEmitter, EventEmitter>> {
  const response = await fetch(uri, { redirect: 'follow' });
  const xmlData = await response.text();
  const xmlParser = new RdfXmlParser({ dataFactory: DataFactory, strict: true });
  const result = new Promise<RDF.Sink<EventEmitter, EventEmitter>>(
    resolve => xmlParser.once('end', () => resolve(store))
  );

  store.import(xmlParser);
  xmlParser.write(xmlData);
  xmlParser.end();
  return result;
}
