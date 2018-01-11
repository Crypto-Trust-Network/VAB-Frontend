import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { Wallet, Transaction, contractAddress } from '../models/graph-models';
import { environment } from '../../../../environments/environment';
import { Guid } from '../models/guid';

@Component({
  selector: 'app-dynamic-logo',
  templateUrl: './dynamic-logo.component.html',
  styleUrls: ['./dynamic-logo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicLogoComponent {
  @ViewChild('nodeGraph') private nodeGraphContainer: ElementRef;

  private margin: any = { top: 0, bottom: 0, left: 0, right: 0 };

  self: any;
  svg: any;
  element: any;
  width: number;
  height: number;
  color: d3.scale.Ordinal<string, string>;
  edgeColor: d3.scale.Ordinal<boolean, string>;;
  simulation: any;
  g: any;
  edgesGroup: any;
  tooltip: any;
  walletsGroup: any;
  maxRadius: number;
  radius: number;

  /**
   * Highlights all wallets with this id
   */
  selectedWallet: Wallet;

  hoveredTransaction: Transaction;

  @Input() showToolTip: boolean = false;

  constructor() {
    this.self = this;
  }

  ngOnInit() {
    this.generateData();

    this.initSVG();
    this.initGraph();
    this.restart();
  }

  initSVG() {

    this.element = this.nodeGraphContainer.nativeElement;
    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.element.offsetHeight - this.margin.top - this.margin.bottom;

    if (this.svg == null) {
      this.svg = d3.select(this.element).append('svg');
    }

    this.svg.attr('width', this.element.offsetWidth)
      .attr('height', this.element.offsetHeight);
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize() {

    //Rescale the SVG
    this.initSVG();

    //Recenter the force
    this.initForce();

    //Restart the graph
    this.restart();

  }

  initForce() {
    //Reset the force
    this.simulation
      .force("link",
      d3.forceLink()
        .id(function (d) { return d.hash; })
        .distance(1)
        .strength(0.8))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter((this.height / 2) + 15, this.height / 2)
      );

    this.simulation.velocityDecay(0.6);
  }

  initGraph() {
    this.maxRadius = 3;
    this.radius = 1.5;

    this.simulation = d3.forceSimulation()
    this.initForce();

    this.g = this.svg.append("g"),
      this.edgesGroup = this.g.append("g").selectAll("line"),
      this.walletsGroup = this.g.append("g").selectAll("circle");

    this.tooltip = this.svg.append("g")
      .attr("visibility", "hidden")

    this.tooltip.append("rect")
      .attr("x", "10")
      .attr("width", "385")
      .attr("y", "10")
      .attr("height", "78")
      .style("fill", "#FFFFFFC0")

    this.tooltip.append("text")
      .attr("id", "tt-time")
      .style("font-size", "12px")
      .attr("x", 20)
      .attr("y", 32);

    this.tooltip.append("text")
      .attr("id", "tt-address")
      .style("font-size", "16px")
      .attr("x", 20)
      .attr("y", 54);

    this.tooltip.append("text")
      .attr("id", "tt-currency")
      .style("font-size", "12px")
      .text("ETH")
      .attr("x", 20)
      .attr("y", 78);

    this.tooltip.append("text")
      .attr("id", "tt-value")
      .style("font-size", "18px")
      .attr("x", 45)
      .attr("y", 78);


  }

  setHighlightWallet(wallet) {
    this.selectedWallet = wallet;
  }



  //This needs called from external
  restart() {

    var color = d3.scaleOrdinal()
      .domain([ColorEnum.grey, ColorEnum.green, ColorEnum.red, ColorEnum.orange])
      .range(['#555', '#009900', '#990000', '#FFA500']);

    var edgeColor = d3.scaleOrdinal()
      .domain([false, true])
      .range(['#aaa', '#AA0000']);



    var self = this;
    self.walletsGroup = self.walletsGroup
      .data(self.wallets);

    self.walletsGroup.exit().remove();

    self.walletsGroup = self.walletsGroup.enter()
      .append("circle")
      .attr("fill", function (d) {
        return color(d.color);
      })
      .attr("stroke", function (d) {
        return d3.rgb(color(d.color));
      })
      .attr("r", function (d) { return d.id == contractAddress ? self.maxRadius : self.radius })
      .on("click", selectNode)
      .on("mouseover", hoverNode)
      .merge(self.walletsGroup)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    self.edgesGroup = self.edgesGroup
      .data(self.transactions);

    self.edgesGroup.exit().remove();

    self.edgesGroup = self.edgesGroup.enter().append("line")
      .attr("stroke-width", function (d) { return Math.sqrt(1); })
      .attr("stroke", function (d) { return edgeColor(d.isError) }).merge(self.edgesGroup);

    this.simulation.nodes(self.wallets).on("tick", ticked);
    this.simulation.force("link").links(self.transactions);
    this.simulation.alpha(1).restart();

    function ticked() {

      self.edgesGroup
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

      self.walletsGroup
        .attr("cx", function (d) {
          return d.x; // Math.max(this.maxRadius, Math.min(this.width - this.maxRadius, d.x)); 
        })
        .attr("cy", function (d) {
          return d.y; // Math.max(this.maxRadius, Math.min(height - this.maxRadius, d.y)); 
        });
    }

    function selectNode(d) {

      if (self.selectedWallet == d) {
        self.selectedWallet = null;
      } else {
        self.selectedWallet = d;
      }
      self.restart();
    }

    function hoverNode(d) {
      if (self.showToolTip) {
        let trans = d.transactions[0];
        self.tooltip.attr("visibility", "visible")
        self.tooltip.select("#tt-address").text(trans.source.id)
        self.tooltip.select("#tt-time").text(trans.timeStamp.toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" }))
        self.tooltip.select("#tt-value").text(trans.value.toLocaleString(undefined, { minimumFractionDigits: 18, maximumFractionDigits: 18 }))
        if (trans.txreceipt_status == 0)
          self.tooltip.select("#tt-value").style("fill", "#990000");
        else
          self.tooltip.select("#tt-value").style("fill", "#000000");
      }
    }


    function dragstarted(d) {
      if (!d3.event.active)
        self.simulation.alphaTarget(1).restart();

      self.simulation.velocityDecay(0.6);

      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active)
        self.simulation.alphaTarget(1);

      self.simulation.velocityDecay(0.9);

      d.fx = null;
      d.fy = null;
    }

  }

  private wallets: Array<Wallet>;
  private transactions: Array<Transaction>;

  populated = false;

  //Four paths with three levels of depth

  //config for home;
  paths = 5;
  badPaths = 1;
  possibleVerifiedWallets = 1;
  depth = 2;
  maxChildren = 2;

  generateData() {
    this.wallets = new Array<Wallet>();
    this.transactions = new Array<Transaction>();

    //Our wallet
    this.wallets.push(new Wallet(contractAddress, ColorEnum.orange));


    for (var i = 1; i <= this.paths; i++) {
      if (i <= this.badPaths) {
        this.generatePath(i, this.depth, ColorEnum.red);
      } else {
        this.generatePath(i, this.depth, ColorEnum.grey);
      }
    }

    this.populated = true;
  }

  generatePath(pathNumber: number, depth: number, color: ColorEnum) {

    //Pointer to the last node
    var lastWallet: Wallet;

    //Create this many paths
    for (var i = 0; i < depth; i++) {

      var percent = 0;

      if (color == ColorEnum.red) {
        percent = 100;
      } else {
        if (Math.random() >= 0.66) {
          color = ColorEnum.green
        }
      };


      var wallet = new Wallet(Guid.MakeNew().ToString(), color);

      //This node needs an edge to the home address
      if (i == 0) {
        lastWallet = wallet;
        this.transactions.push(new Transaction(1, Guid.MakeNew().ToString(), ColorEnum.red == color, new Date(), wallet, this.wallets[0], Math.random(), 1))
      } else {

        var children = Math.floor(Math.random() * this.maxChildren);

        for (var x = 0; x < children; x++) {
          var anotherWallet = new Wallet(Guid.MakeNew().ToString(), color);
          this.wallets.push(anotherWallet);
          this.transactions.push(new Transaction(1, Guid.MakeNew().ToString(), ColorEnum.red == color, new Date(), anotherWallet, lastWallet, Math.random(), 1))
        }

        this.transactions.push(new Transaction(1, Guid.MakeNew().ToString(), ColorEnum.red == color, new Date(), wallet, lastWallet, Math.random(), 1))
        lastWallet = wallet;
      }

      this.wallets.push(wallet);
    }
  }
}

export enum ColorEnum {
  green,
  grey,
  red,
  orange
}