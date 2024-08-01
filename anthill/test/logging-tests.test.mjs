import { expect } from 'chai';
// import { testCases, runTestCases, pullModel } from '../../../server/index.js';

import { db } from "./logging-tests.mjs";
import { doc, getDoc, setDoc, deleteDoc} from "firebase/firestore"


describe('creating, destroying, and reading from a document', () => {
    // This test really only tests the database is set up properly.
    // Note that these tests are all async, so they cannot rely on previous blocks.

    it('create and delete document with name testDocument and one entry', async () => {
        // writing test document (if already written, this test only tests reading and deleting)
        const userDocRef = doc(db, 'testCollection', 'testDocument');
        const currTime = new Date();
        await setDoc(userDocRef, {
            time: currTime
        });

        // Read the document and assert it was written
        const userDocSnap = await getDoc(userDocRef);
        expect(userDocSnap.exists()).to.be.true;
        expect(userDocSnap.data().time.toDate().toISOString()).to.equal(currTime.toISOString());

        // delete the document (if it already exists then we delete it)
        await deleteDoc(userDocRef);

        // Read the document again and assert it has been deleted
        const deletedDocSnap = await getDoc(userDocRef);
        expect(deletedDocSnap.exists()).to.be.false;
    });

    it('', () => {
        
    });
});