import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon'
import BasicForTest from '@/components/BasicForTest.vue'

const wrapper = shallowMount(BasicForTest, {
  propsData: {
    show: true
  }
})

const clickMethodStub = sinon.stub()

describe('BasicForTest Component', () => {

  // Attributes
  // Returns Wrapper DOM node attribute object. If key is provided, the value for the key will be returned.
  it('testing attributes', () => {
    console.log(wrapper.attributes()) // { id: 'main-div', class: 'container' }
    expect(wrapper.attributes('id')).toBe('main-div')
    expect(wrapper.attributes('class')).toBe('container mt50')
    expect(wrapper.attributes().id).toBe('main-div')
  })


  // Classes
  // Return Wrapper DOM node classes. Returns Array of class names. Or a boolean if a class name is provided.
  it('testing classes', () => {
    console.log(wrapper.classes()) // [ 'container', 'mt50' ]
    expect(wrapper.classes()).toContain('container')
    expect(wrapper.classes('container')).toBe(true)

    // Testing on a sub element
    let paragraph = wrapper.find('.custom-p')
    expect(paragraph.exists()).toBe(true)
    expect(paragraph.classes('custom-p')).toBe(true)
  })


  // Contains
  // Assert Wrapper contains an element or component matching selector.
  it('testing contains', () => {
    expect(wrapper.contains('p')).toBe(true)
  })


  // Emitted
  // Return an object containing custom events emitted by the Wrapper vm.
  it('testing emitted', () => {
    wrapper.vm.$emit('event1')
    wrapper.vm.$emit('event1', 123)
    expect(wrapper.emitted().event1).toBeTruthy()
    expect(wrapper.emitted().event1.length).toBe(2)
    expect(wrapper.emitted().event1[1]).toEqual([123])
  })


  // emittedByOrder
  // Return an Array containing custom events emitted by the Wrapper vm.
  it('testing emittedByOrder', () => {
    wrapper.vm.$emit('event2')
    console.log(wrapper.emittedByOrder()) // [ { name: 'event1', args: [] }, { name: 'event1', args: [123] }, { name: 'event2' } ]
    expect(wrapper.emittedByOrder().map(event => event.name)).toEqual(['event1', 'event1', 'event2'])
  })


  // Exists
  // Assert Wrapper or WrapperArray exists.
  it('testing exists', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.does-not-exists').exists()).toBe(false)
  })


  // Find
  // Returns Wrapper of first DOM node or Vue component matching selector.
  it('testing find', () => {
    expect(wrapper.find('.custom-p').exists()).toBe(true)
    expect(wrapper.find(BasicForTest).exists()).toBe(true)
    expect(wrapper.find('#email-input').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find({name: 'basicForTest'}).exists()).toBe(true) // component name
    expect(wrapper.find({ref: 'container'}).exists()).toBe(true)
  })


  // FindAll
  // Returns a WrapperArray.
  it('testing findAll', () => {
    expect(wrapper.findAll('div').length).toBe(2)
  })


  // Html
  // Returns HTML of Wrapper DOM node as a string.
  it('testing html', () => {
    // console.log(wrapper.html())
    expect(wrapper.html()).toContain('<p class="custom-p">Content</p>')
  })


  // is(selector)
  // Assert Wrapper DOM node or vm matches selector.
  it('testing is(selector)', () => {
    expect(wrapper.is('div')).toBe(true)
    let paragraph2 = wrapper.find('.another-p')
    expect(paragraph2.is('p')).toBe(true)
  })


  // isEmpty()
  // Assert Wrapper does not contain child node.
  it('testing isEmpty', () => {
    expect(wrapper.find('.empty-p').isEmpty()).toBe(true)
  })


  // isVisible()
  // Assert Wrapper is visible.
  // Returns false if an ancestor element has display: none or visibility: hidden style.
  // This can be used to assert that a component is hidden by v-show.
  it('testing isVisible', () => {
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('.hidden-p').isVisible()).toBe(false)
  })


  // isVueInstance()
  // Assert Wrapper is Vue instance.
  it('testing isVueInstance', () => {
    expect(wrapper.isVueInstance()).toBe(true)
    let paragraph = wrapper.find('.custom-p')
    expect(paragraph.isVueInstance()).toBe(false)
  })


  // Name
  // Returns component name if Wrapper contains a Vue instance,
  // or the tag name of Wrapper DOM node if Wrapper does not contain a Vue instance.
  it('testing Name', () => {
    expect(wrapper.name()).toBe('basicForTest')
    let paragraph3 = wrapper.find('.name-p')
    expect(paragraph3.name()).toBe('p')
  })


  // Props(key)
  // Return Wrapper vm props object. If key is provided, the value for the key will be returned.
  it('testing Props', () => {
    expect(wrapper.props('show')).toBe(true)
  })


  // setChecked
  // Sets checked value for input element of type checkbox or radio and updates v-model bound data.
  it('testing setChecked', () => {
    const radioOption = wrapper.find('#male')
    expect(wrapper.vm.gender).toBe('')
    radioOption.setChecked()
    expect(wrapper.vm.gender).toBe('male')
  })


  // setData
  // Sets Wrapper vm data. setData works by recursively calling Vue.set.
  it('testing setData', () => {
    // console.log(wrapper.vm.name)
    wrapper.setData({name: 'Jack Johnson'})
    // console.log(wrapper.vm.name)
    expect(wrapper.vm.name).toBe('Jack Johnson')
  })


  // setMethods
  // Sets Wrapper vm methods and forces update.
  it('testing setMethods', () => {
    wrapper.setMethods({clickMethod: clickMethodStub})
    const button = wrapper.find('#test-setmethod')
    button.trigger('click')
    expect(clickMethodStub.called).toBe(true)
  })


  // setProps(props)
  // Sets Wrapper vm props and forces update.
  it('testing setProps', () => {
    wrapper.setProps({type: 'admin'})
    expect(wrapper.vm.type).toBe('admin')
  })


  // setSelected
  // Selects an option element and updates v-model bound data.
  it('testing setSelected', () => {
    const options = wrapper.find('select').findAll('option')
    options.at(1).setSelected()
    expect(wrapper.vm.selected).toBe('A')
    options.at(2).setSelected()
    expect(wrapper.vm.selected).toBe('B')
  })


  // setValue(value)
  // Sets value of a text-control input or select element and updates v-model bound data.
  it('testing setValue', () => {
    let input = wrapper.find('input[type="text"]')
    input.setValue('some value')
    expect(wrapper.vm.message).toBe('some value')
  })


  // text
  // Returns text content of Wrapper.
  it('testing text', () => {
    let container = wrapper.find('.text-container')
    expect(container.text()).toBe('cowabonga')
    expect(container.text()).toContain('bonga')
  })


  // trigger(eventType [, options ])
  // Triggers an event on the Wrapper DOM node.
  // Under the hood, trigger creates an Event object and dispatches the event on the Wrapper element.
  it('testing classes', () => {
    wrapper.setData({email: 'aaaa@gmail.com'})
    expect(wrapper.vm.email).toBe('aaaa@gmail.com')
    let emailInput = wrapper.find('#email-input')
    emailInput.trigger('blur')
    expect(wrapper.vm.email).toBe('AAAA@GMAIL.COM')
  })





})