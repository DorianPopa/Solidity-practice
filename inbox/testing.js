class ClassToTest {
    function1(){
        return "result 1";
    }
    function2(){
        return "result 2";
    }
}

let testInstance;
beforeEach(() => {
    testInstance = new ClassToTest();
});
 
 describe("ClassToTest", () => {
    it('function1 test', () => {
        assert.strictEqual(testInstance.function1(), 'result 1')
    })
    it('function2 test', () => {
        assert.strictEqual(testInstance.function2(), "result 2");
    })
})